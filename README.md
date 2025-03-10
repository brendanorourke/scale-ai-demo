
# Car Damage Assessment App

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A web application that analyzes car damage photos using AI and provides damage assessments and repair estimates.

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn installed

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` by default.

### API Key Configuration

This application requires an OpenAI API key for image analysis functionality. You will need to:

1. Create an account at [OpenAI](https://openai.com/)
2. Generate an API key in your account dashboard
3. Enter the API key in the application settings (top-right gear icon)

## Architecture Overview

### Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui component library
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API
- **API Integration**: OpenAI's GPT-4 Vision for image analysis
- **Notifications**: Sonner toast notifications

### Data Flow

1. **Image Upload**: Users upload car damage photos either via file upload or URL
2. **API Processing**: Images are sent to OpenAI's API with custom prompts for damage assessment
3. **Result Display**: Analysis results are displayed including car details, damage description, and estimated repair costs
4. **Claim Filing**: Users can proceed to file an insurance claim with the analysis results

### Key Components

- **Wizard Flow**: Multi-step process for guiding users through the assessment
- **Image Uploader**: Handles file uploads, drag-and-drop, and URL-based image imports
- **API Key Management**: Secure storage and management of API keys
- **Analysis Service**: Integration with AI services for image processing
- **Responsive UI**: Mobile-friendly design that works across devices

### Project Structure

```
src/
├── components/         # UI components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   ├── settings/       # Settings-related components
│   ├── ui/             # UI library components
│   └── wizard/         # Wizard flow components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
└── services/           # API and service integrations
    ├── api/            # API client implementations
    └── imageAnalysis/  # Image processing logic
```

## Usage

1. Start at the welcome screen and proceed through the wizard
2. Upload a photo of car damage (file upload or URL)
3. Review the AI-powered damage assessment
4. Proceed to file a claim with the analysis results

## Development

### Code Organization

- **Component Structure**: Follows a modular approach with focused, single-responsibility components
- **State Management**: Uses React Context for global state and local state for component-specific data
- **API Services**: Isolated in service modules for better separation of concerns
- **UI Components**: Leverages shadcn-ui with Tailwind for consistent styling

### Best Practices

- **TypeScript**: Strong typing throughout the application
- **Error Handling**: Comprehensive error handling for API calls and user interactions
- **Responsive Design**: Mobile-first approach for all UI components
- **Accessibility**: ARIA attributes and keyboard navigation support

## License

This project is licensed under the MIT License - see the LICENSE file for details.
