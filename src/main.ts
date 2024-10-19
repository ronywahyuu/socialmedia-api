import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  console.log('JWT_SECRET', process.env.JWT_SECRET);
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  app.use('/swagger-custom.js', express.static(join(__dirname, '..', 'public/swagger-custom.js')));


  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('API Documentation for Blog')
    .setVersion('1.0')
    // .addTag('blog')
    .addBearerAuth()
    .build();
  // const documentFactory = () => SwaggerModule.createDocument(app, config);
  const document = SwaggerModule.createDocument(app, config);

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      plugins: [
        {
          statePlugins: {
            auth: {
              wrapActions: {
                authorize: (oriAction, system) => (authData) => {
                  const { email, password } = authData;
                  fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      const accessToken = data.accessToken;
                      system.authActions.authorize({ Bearer: accessToken });
                    })
                    .catch((error) => console.error('Login failed', error));
                },
              },
            },
          },
        },
      ],
    },
  };


  SwaggerModule.setup('api', app, document, {
    customJs: '/swagger-custom.js',
  });
  await app.listen(8080);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { AppModule } from './app.module';
// import * as express from 'express';
// import { join } from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use('/swagger-custom.js', express.static(join(__dirname, '..', 'public/swagger-custom.js')));

//   const config = new DocumentBuilder()
//     .setTitle('Custom API')
//     .setDescription('API with Custom Swagger UI')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
  
//   SwaggerModule.setup('api', app, document, {
//     customJs: '/swagger-custom.js',
//   });

//   await app.listen(3000);
// }
// bootstrap();
