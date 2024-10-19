window.onload = function () {
  const ui = SwaggerUIBundle({
    url: "/api-json",
    dom_id: '#swagger-ui',
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    layout: "StandaloneLayout",
    plugins: [
      SwaggerUIBundle.plugins.AuthorizePlugin.extend({
        components: {
          AuthorizeButton: () => {
            return (
              <div>
                <form id="login-form">
                  <input type="text" id="email" placeholder="Email" />
                  <input type="password" id="password" placeholder="Password" />
                  <button type="button" id="login-btn">Login</button>
                </form>
              </div>
            );
          }
        }
      })
    ]
  });

  document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      const accessToken = data.accessToken;
      ui.preauthorizeApiKey("bearerAuth", accessToken);
    })
    .catch(error => console.error('Login failed', error));
  });
};
