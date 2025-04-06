# Deploying to Netlify

This guide will walk you through deploying your Open-Source Contribution Finder application to Netlify.

## Prerequisites

- A GitHub account
- A Netlify account (you can sign up for free at [netlify.com](https://www.netlify.com/))
- Your project pushed to a GitHub repository

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended for beginners)

1. **Push your code to GitHub**
   - Create a repository on GitHub
   - Push your local code to the repository

2. **Sign in to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Sign in with your Netlify account

3. **Create a new site**
   - Click on "Add new site" > "Import an existing project"
   - Select GitHub as your Git provider
   - Authorize Netlify to access your GitHub account
   - Select your repository

4. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click on "Deploy site"

5. **Wait for deployment**
   - Netlify will build and deploy your site
   - Once complete, you'll get a unique URL to access your site

6. **Set up a custom domain (optional)**
   - In your site settings, go to "Domain management"
   - Add your custom domain and follow the instructions

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify in your project**
   ```bash
   netlify init
   ```
   - Follow the prompts to connect to your Netlify account
   - Select "Create & configure a new site"

4. **Deploy your site**
   ```bash
   netlify deploy --prod
   ```

## Continuous Deployment

Once set up, Netlify will automatically deploy your site whenever you push changes to your GitHub repository. The `netlify.toml` file in your project root configures the build settings.

## Troubleshooting

- If your build fails, check the build logs in Netlify for specific errors
- Ensure all dependencies are properly listed in your package.json
- Make sure your application works locally with `npm run build && npm run preview`

## Environment Variables

If your application uses environment variables:
1. Go to Site settings > Build & deploy > Environment
2. Add your environment variables

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)