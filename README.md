# IFRC-GO-Make-Maps-Frontend

IFRC-GO-Make-Maps-Frontend is a [short description of your project]. This React-based web application is designed to [describe the primary goal or purpose of your application].

## Features

- Feature 1: [Brief description of feature 1]
- Feature 2: [Brief description of feature 2]
- Feature 3: [Brief description of feature 3]
- ...

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js [version] or higher is installed.
- Yarn [version] or npm [version] is installed (depending on your preferred package manager).

## Installation

Follow these steps to set up and run [IFRC-GO-Make-Maps-Frontend]:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/yourprojectname.git
````

2. Navigate to the project directory:
````bash
cd yourprojectname
````

3. Install the dependencies:
````bash
yarn install
# OR
npm install
````

4. Start the development server:
````bash
yarn start
# OR
npm start
````

Your application should now be running on http://localhost:3000.

## Usage
Provide instructions on how to use your application, including any necessary configuration steps, user registration, or feature explanations.

##Azure setup 

````bash
## Azure Setup

This project is designed to be deployed to an Azure Web App using a Docker container. Follow these steps to set up an Azure Web App for your project:

1. Sign in to the [Azure Portal](https://portal.azure.com/) with your Azure account.

2. In the left-hand menu, click on "Create a resource."

3. In the search bar, type "Web App" and select the "Web App" option from the results.

4. Click the "Create" button to begin configuring your Web App.

5. Fill in the following details for your Web App:

   - Subscription: Select your desired Azure subscription.
   - Resource Group: Create a new resource group or use an existing one.
   - Name: Choose a unique name for your Web App (e.g., `yourprojectname-webapp`).
   - Operating System: Select "Linux".
   - Publish: Choose "Docker Container".
   - Region: Select a region close to your target users for better performance.
   - App Service Plan: Create a new plan or use an existing one, and select the desired pricing tier.

6. Click the "Next: Docker" button to configure your container settings.

7. Choose "Single Container" as your container type.

8. Select "GitHub Container Registry (ghcr.io)" as your registry.

9. Enter the image name and tag in the "Image and tag" field (e.g., `ghcr.io/yourusername/yourprojectname:latest`).

10. Click "Review + create" to review your Web App settings.

11. After reviewing, click "Create" to deploy your Web App.

12. Once your Web App is created, navigate to the "Deployment Center" in your Web App's settings.

13. Choose "GitHub Actions" as your deployment method and follow the instructions to configure the GitHub Actions workflow.

Make sure to update the `env.AZURE_WEBAPP_NAME` value in your GitHub Actions workflow file (`.github/workflows/main.yml`) with the name you chose for your Web App.
````

## Github Action
````yaml
## GitHub Actions

This project uses GitHub Actions to build and deploy a container to an Azure Web App. The workflow is defined in the `.github/workflows/main.yml` file.

```yaml
name: Build and deploy a container to an Azure Web App

env:
  AZURE_WEBAPP_NAME: IFRC-GO-Make-Maps-Frontend  

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

permissions:
  contents: read
  packages: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Log in to GitHub container registry
        uses: docker/login-action@v1.10.0
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ github.token }}

      - name: Lowercase the repo name and username
        run: echo "REPO=${GITHUB_REPOSITORY,,}" >>${GITHUB_ENV}

      - name: Build and push container image to registry
        uses: docker/build-push-action@v2
        with:
          context: ./frontend
          push: true
          tags: ghcr.io/${{ env.REPO }}:${{ github.sha }}
          file: ./frontend/Dockerfile

  deploy:
    permissions:
      contents: none
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: 'Development'
      url: ${{ steps.deploy-to-webapp.outputs.webapp-url }}

    steps:
      - name: Lowercase the repo name and username
        run: echo "REPO=${GITHUB_REPOSITORY,,}" >>${GITHUB_ENV}

      - name: Deploy to Azure Web App
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZUREAPPSERVICE_PUBLISHPROFILE_FRONTEND }}
          images: 'ghcr.io/${{ env.REPO }}:${{ github.sha }}'

````

# IFRC-GO-Make-Maps
IFRC GO Make Maps for Disaster Response Frontend

https://ifrc-go-make-maps-frontend.azurewebsites.net/
