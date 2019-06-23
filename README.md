# Boardfarm Server based on Vue

A simple front-end web application for boardfarm.

## Quick Start for developers

1. Install node for your machine https://nodejs.org/en/download/
    ```sh
    # Ubuntu 18
    sudo apt update
    sudo apt install nodejs npm
    ```
1. Clone this project
    ```sh
    git clone git@github.com:mbanders/boardfarm_server_vue.git
    ```
1. Install needed libraries
    ```sh
    cd boardfarm_server_vue/
    npm install
    ```
1. Let this app know where the backend is served from. Edit the file `src/store/store.js`:
    ```js
    loadStations ({ commit }) {
        axios
        .get('http://boardfarm.bluejam.net/api/stations')
    ```
1. Start server
    ```sh
    npm run serve
    ```
1. Visit http://localhost:8080/ to see your website.

## Serving for Production

This frontend web app is only static files, so it could be served by any webserver software you wish. Here we use Apache:

1. Install needed libraries
    ```sh
    sudo apt update
    sudo apt install apache2 nodejs npm
    ```
1. Install needed apache mods (this will allow serving both frontend and backend using a proxy)
    ```sh
    sudo a2enmod proxy
    sudo a2enmod proxy_http
    sudo a2enmod proxy_balancer
    sudo a2enmod lbmethod_byrequests
    ```
1. Clone this project & build static files to be served
    ```sh
    git clone git@github.com:mbanders/boardfarm_server_vue.git
    cd boardfarm_server_vue/
    npm install
    npm run build
    ```
    The above creates a `dist/` directory containing an `index.html` and other files.
1. Modify your apache site configuration file, default is `/etc/apache2/sites-enabled/000-default.conf`. The full path to the `dist/` directory from above step is needed in two spots. And then add the two proxy lines are so that you can serve the boardfarm server backend being served by node:
    ```apache
    <VirtualHost *:80>
        <Directory /path/to/boardfarm_server_vue/dist>
            Options FollowSymLinks
            AllowOverride None
            Require all granted
        </Directory>
        ...
        DocumentRoot /path/to/boardfarm_server_vue/dist
        ...
        
        ProxyRequests on
        ProxyPass /api/ http://localhost:5001/api/
    </VirtualHost>
    ```
1. Restart apache
    ```sh
    sudo service apache2 restart
    ```

You should now be able to visit http://localhost/ to see this frontend project, and also http://localhost/api/ to see the backend.
