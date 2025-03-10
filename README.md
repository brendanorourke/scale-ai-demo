
# 🚗 Car Damage Assessment Assistant

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A modern web application for analyzing car damage using AI vision capabilities. Upload images of damaged vehicles to receive detailed assessments including vehicle identification, damage description, and repair cost estimates.

## 🚀 Live Demo

Visit [the deployed application](https://lovable.dev/projects/b0b71e5b-a675-4347-805a-3275aa3c650a) to try it out.

## 📋 Features

- **Image Upload**: Easily upload photos of damaged vehicles
- **AI-Powered Analysis**: Get detailed assessment using advanced AI vision models
- **Vehicle Identification**: Automatic detection of make, model, and color
- **Damage Assessment**: Comprehensive description of visible damage
- **Cost Estimation**: Approximate repair cost ranges in USD
- **Provider Support**: Currently supports OpenAI (GPT-4o Vision), with Anthropic Claude coming soon

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- An OpenAI API key with access to GPT-4o

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd car-damage-assessment

# Install dependencies
npm install
```

### Configuration

This application requires an OpenAI API key to function. Your API key is stored securely in your browser's local storage.

### Running the Application

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom insurance-themed color palette
- **UI Components**: Shadcn UI
- **Routing**: React Router
- **State Management**: React Context API
- **API Integration**: OpenAI GPT-4o vision API
- **Data Fetching**: TanStack React Query

### Data Flow

1. **User Upload**: User uploads an image of a damaged vehicle
2. **Image Processing**: Image is converted to base64 format for API transmission
3. **API Request**: Encoded image is sent to OpenAI's API with a specialized prompt
4. **Analysis**: The AI model analyzes the image for vehicle details and damage assessment
5. **Response Processing**: JSON response is parsed and displayed to the user
6. **User Interface**: Results are presented in an organized, easy-to-read format

### Key Components

- **WizardContext**: Manages the multi-step wizard flow and assessment data
- **ApiKeyContext**: Handles API key storage and provider selection
- **Image Analysis Service**: Interfaces with OpenAI's API for image analysis
- **Step Components**: Dedicated components for each wizard step (Welcome, Upload, Results)

## 📱 Responsive Design

The application is fully responsive and works on devices of all sizes, from mobile phones to desktop computers.

## 🔐 Security

- API keys are stored locally in the browser's localStorage
- API keys are never transmitted to our servers
- All API requests are made directly from the client to OpenAI

## 🧩 Future Enhancements

- **Anthropic Integration**: Support for Claude models coming soon
- **Export Functionality**: Ability to export assessment reports as PDF
- **History Management**: Save and review previous assessments
- **Detailed Repair Breakdown**: Itemized repair cost estimates
- **Multi-Image Support**: Analyze multiple angles of the same vehicle

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) for providing the GPT-4o Vision API
- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Vite](https://vitejs.dev/) for the build tool
