
# 🚗 Insurance Claim Assessment App

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A web application to demonstrate the usage of AI vision capabilities for frontline assessments of vehicle indentification, damage description, and repair cost estimates.

## Usage

1. Start at the welcome screen and proceed through the wizard
2. Upload a photo of car damage (file upload or URL)
3. Review the AI-powered damage assessment
4. Proceed to file a claim with the analysis results

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn installed

### Installation

```bash
# Clone the repository
git clone https://github.com/brendanorourke/scale-ai-demo

# Navigate to the project directory
cd scale-ai-demo

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` by default.

### API Key Configuration

This application requires an OpenAI API key for image analysis functionality. You will need to:

1. Create an account at [OpenAI](https://openai.com/)
2. Login to OpenAI [API Platform](https://platform.openai.com/login)
2. Generate an [API key](https://platform.openai.com/settings/organization/api-keys) in your account dashboard
3. Enter the API key in the application settings (top-right gear icon)

## Architecture Overview

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

### High-level Application Flow

1. **Get Started**: User clicks get started (`src/components/wizard/Step1Welcome.tsx`)
2. **Image Upload**: User uploads an image (`src/components/wizard/Step2Upload.tsx`)
3. **Results**: User moves to results page ( `src/components/wizard/Step3Results.tsx`)
4. **API Request**: `Step3Results.tsx` initiates the analysis process, calling `analyzeImage()` from `services/imageAnalysis.ts`
5. **API Request Processing**: `analyzeImage()` validations the API key and makes a POST request to OpenAI with encoded image data and prompt.
6. **API Response Processing**: Data parsed in JSON and provided via `onProgress` callback.
7. **UI Update**: `Step3Results.tsx` receives the result via `setAnalysisResult()` function, displaying either loading state, results or errors.

### Key Components

- 🧙 **Wizard Flow**: Multi-step process for guiding presentation and discussion around key milestones in the flow.
- 📷 **Image Uploader**: Easy file uploads with drag-and-drop and URL imports to allow for multiple demos on the same page.
- 🔑 **API Key Management**: Local storage of API keys for security and ease of use.
- 🤝 **API Integration**: Integrates directly with OpenAI's API (with future support for Anthropic) to abstract backend components.
- 📱 **Responsive UI**: Mobile-friendly design that works across devices.

## Brief Design Explanation

### Tools Used
- ❤️ [Lovable.dev](https://lovable.dev/): Used for rapid prototyping, iteration, and hosting. Key reasons for selection include:
  - Satisfied goal of removing as much manual dev/boilerplate as possible, given 3h target for ideation, dev, testing, and docs.
  - Positive developer community sentiment (e.g., on Reddit).
  - Integration with GitHub for step-by-step (commit level) transparency and easy code edits (Bolt.new does not integrate directly).
  - Handles hosting natively, although in the future would like to assess vs. Vercel/Netlify.
  - Honestly, I wanted to try it out 😊

### Key Compromises

- 💽 **Backend**: Given time constraint and lack of _emphasis_ on backend functionality in the prompt, we're assuming that backend functionality was not a primary concern for the prospect.
  - Thus, the processing logic is handled directly with OpenAI's API without a dediated backend service.
  - Benefit: Minimal complexity and opportunity for error in the demo.
  - Benefit: Easy reference of functionality by developers, as a full backend service would be largely boilerplate.
  - Compromise: If the technical audience had specific backend-related concerns, this would obviously not satisfy that.
- 🔒 **Security**: As we do not have a full backend, API Keys need to be abstracted from the codebase and handled via localStorage.
  - Benefit: No need to handle authentication and secrets management, freeing up time for other work.
  - Benefit: Easy to share the application and switch accounts as needed (e.g., if there are any unforeseen quota errors etc.).
  - Compromise: Additional step for the user which may be missed.
  - Compromise: API keys need to be set per browser (in localStorage).

### AI Logic
- For speed to develop, we use the out-of-box `gpt-4o` model from OpenAI.
- Prompt engineering performed to ensure reasonable output.
  - Example: `You are an expert automotive damage assessor with decades of experience in the insurance industry...`
  - Example: `If you cannot determine any information with confidence, respond with "TBD" for that specific field...`
  - Example: `Format your response as JSON with the following structure...`
- The goal being to demonstrate a baseline value that LLMs can provide without _any_ fine tuning etc.
  - "This is the worst it will ever be..."

### Potential Improvements
- **Multiple Images**: Ability for the user to submit multiple images with multiple angles of the car.
  - Would potentially increase efficacy and mimic real-world use cases more closely.
- **History Management**: Ability to submit multiple claims asssessments and having those be referencable on a Dashbaord page.
  - Potentially with "Status" after submission to demonstrate how a user would manage these claims submissions.
- **Detailed Repair Breakdown**: In addition to a high-level cost range, break down an itemized estimate-- would require testing and possible fine tuning.
- **User Authentication**: To support the above, we would ideally also have user authentication, which would require the implementation of a backend.
  - Users can submit images and come back later to reference them.
  - Prospects can continue to play around with the tool and not "lose" their work.
- **Additional Model Providers**: Placeholder Anthropic functionality was implemented to demonstrate the desire to A/B test different models for efficacy.
  - Ideally, we would have an internal mapping of model providers to perceived best use-cases, either via benchmarks or personal experience.
  - For this exercise, OpenAI was selected immediately to unblock the process.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
