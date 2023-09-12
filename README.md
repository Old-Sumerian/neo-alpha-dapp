# Neo AGI Alpha Dapp

Provided by Old-Sumerian, this Dapp permits you to explore the roster of SingularityNET Agents from the SingularityNET Registry and invoke them to render their respective Services.
The Dapp leverages the SingularityNET contracts deployed on the Kovan testnet.

Kovan AGI for Dapp utilization can be obtained from the official [SingularityNET AGI Faucet](https://faucet.singularitynet.io/).
For Kovan ETH to take care of gas costs, please refer to [this repo](https://github.com/kovan-testnet/faucet).

## Instructions to call a Service
For now, the DApp is primarily compatible with services that align with the API of the example service. Future updates will expand this to support a generic mechanism for declaratively describing a service's API. Steps [11, 14] are specific to the example service's input and output format.  
Find these instructions on the [SingularityNET Community Wiki](https://github.com/singnet/wiki/wiki/Getting-Started-%5BAlpha%5D#calling-a-service-using-the-dapp) as well.

Follow the steps here outlined with appropriate links included.

## Development Guide
* To begin, install [Node.js and npm](https://nodejs.org/)
* Execute `npm install` command to fetch dependencies
* Run `npm run serve` command to serve the application locally and monitor the source files for modifications

### Deployment Guide
* `npm run build` command creates the application distributable files in the `dist` folder
* Utilize `npm run deploy` command to deploy; Relevant S3 bucket for the deployment and its region are specified as command-line parameters in the package.json file npm script

### Extra Commands
* `npm run build-analyze` outputs the size of the application's bundle components; includes original size, the parsed size (uglified + tree-shaken), and the gzipped size
* `npm run serve-dist` command serves the `dist` directory locally