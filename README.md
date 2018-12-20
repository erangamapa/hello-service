# HTTP hello Service

This is Greet microservice based on JWT using nodejs

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to have latest stable node version and yarn package manager installed in order to run this locally.

* [Nodejs](https://nodejs.org/en/download/) - Technology used to impliment.
* [Yarn](https://yarnpkg.com/lang/en/docs/install/) - Dependency Management.


### Running

Install Dependencies

```
yarn install
```

Run the project

```
yarn start
```

## Usage

Visit ```/api-docs``` to detail breakdown of the API and try it out


## Testing

To test the project

```
yarn test
```

## Deployment

To build docker image

```
docker build . -t <yourname>/hello-service
```

To run docker image
(Make sure your port 6020 is free or change to a free one)

```
docker run -p 6020:6020 eranmapa/auth-service
```

## Assumptions and Other Details

* Only unit test are written isolating logic units written by me by mocking other dependencies.
* High quality secret for jwt generation is genarated via [GRC](https://www.grc.com/passwords.htm)
* Secret used for JWT is saved in dockerfile as env variable for release and assuming its safe there.
* Assuming that validating JWT token inhouse is sufficent than calling auth microservice to validate.


## Important Dependencies

* **jsonwebtoken** - To generate jwt
* **supertest** - To run node server independently for testing
* **swagger-ui-express** - To present the api documentation and try
* **proxyquire-2** - Use to mock libs when unit testing
* **node-mocks-http** - To mock http requests


## Authors

* **Eranga Mapa** - *My Work* - [MapaonboardBlog](http://mapaonboard.blogspot.com/)

## License

This project is licensed under the MIT License

