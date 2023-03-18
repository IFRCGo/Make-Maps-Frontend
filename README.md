# IFRC GO Make Maps Frontend

The versatility of the web tool is apparent as it offers various features such as drawing, adding pins with notes, and multiple map layers. This makes it a game-changer in different fields, such as disaster reporting, planning, tech, consulting, and utilities. Additionally, the web tool supports real-time collaboration, making it an excellent solution for teams working on disaster response efforts.

As an overview, the IFRC GO Make Map is aimed to:

- Increase the workflow efficiency of an IFRC reporter creating a map.
- Enable reporters and analysts to create rich reports with critical data.
- Encourage public donations.
- Assist national societies, other humanitarian organisations, and the general public to gain important information about disasters that have occurred.
- Enable donors to understand critical information about events in regions to encourage them to donate
- Effectively support and respond to emergency incidents in the field.
- Assist the organisations with relief planning with greater knowledge of the region’s disasters.

## Demo

This is the demo for the project: https://www.youtube.com/watch?v=DSyl1Z1y9Pw

## Intial UI Designs

![UI Design Home](https://github.com/IFRC-GO-Make-Maps/IFRC-GO-Make-Maps-Frontend/blob/main/README%20Assets/UI_Design_Home.png)

![UI Design Map](https://github.com/IFRC-GO-Make-Maps/IFRC-GO-Make-Maps-Frontend/blob/main/README%20Assets/UI_Design_Map.png)

## Contact

![Project Logo](https://github.com/IFRC-GO-Make-Maps/IFRC-GO-Make-Maps-Frontend/blob/main/README%20Assets/IFRC_Group.jpg)

If you have any questions or concerns, please reach out to:

- Piraveenan Kirupakaran (Team Leader): p.kirupakaran@ucl.ac.uk
- Tao Huang: tao.huang.22@ucl.ac.uk
- Yizhou Li: ucabiaz@ucl.ac.uk
- Jaden Wan: jaden.wan.22@ucl.ac.uk
- Yi-Hsin: yi-hsien.hsin.22@ucl.ac.uk
- Daniel Swarup: daniel.swarup.22@ucl.ac.uk

Project URL: https://ifrc-go-make-maps-frontend.azurewebsites.net/

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js [v19.6.0] or higher is installed.
- Yarn [1.22.19] or npm [9.4.0] is installed (depending on your preferred package manager).

## Dependencies

| Package                             | Version |
| ----------------------------------- | ------- |
| @apollo/client                      | ^3.7.7  |
| @mapbox/mapbox-gl-draw              | ^1.4.0  |
| antd                                | ^5.1.5  |
| graphql                             | ^16.6.0 |
| graphql-ws                          | ^5.12.0 |
| html2canvas                         | ^1.4.1  |
| jspdf                               | ^2.5.1  |
| mapbox-gl-draw-paint-mode           | ^1.1.1  |
| mapbox-gl-draw-point-with-text-mode | ^1.0.2  |
| maplibre-gl                         | ^2.4.0  |
| react                               | ^18.2.0 |

## Installation

Follow these steps to set up and run IFRC GO Make Maps Frontend:

1. Clone the repository:

```bash
git clone https://github.com/IFRC-GO-Make-Maps/IFRC-GO-Make-Maps-Frontend
```

2. Navigate to the project directory:

```bash
cd frontend/
```

3. Install the dependencies:

```bash
yarn install
# OR
npm install
```

4. Start the development server:

```bash
yarn start
# OR
npm start
```

Your application should now be running on http://localhost:3000.

## Usage

Provide instructions on how to use your application, including any necessary configuration steps, user registration, or feature explanations.

# Azure setup

```bash
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
```

## Contributing

If you'd like to contribute to _IFRC GO Make Maps_, please follow these steps:

Fork the repository.
Create a new branch with a descriptive name (e.g., feature/awesome-feature).
Make your changes and commit them with a clear and concise commit message.
Push your changes to your forked repository.
Create a pull request and describe the changes you've made.
