import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {

    @ApiProperty()
    email: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}

export class LoginDto {
  
      @ApiProperty({
        default: 'rony@gmail.com'
        
      })
      email: string;

      @ApiProperty({
        default: 'rony'
      })
      username: string;
  
      @ApiProperty({
        default: '123456'
      })
      password: string;
}