
# Interactive Quiz Application

This project is an interactive quiz application built using Next.js, React, Supabase, and Tailwind CSS. The application allows users to take quizzes on various topics and provides immediate feedback on their answers. It also generates a summary of the user's performance at the end of the quiz.

## Table of Contents

- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Project Structure

The project follows the standard Next.js project structure:

- `app/`: Contains the main application components and pages.
  - `components/`: Contains reusable components used in the application.
    - `QuizApp.js`: The main component that handles the quiz functionality.
  - `globals.css`: Global CSS styles for the application.
  - `layout.js`: Defines the overall layout of the application.
  - `page.js`: The main page component that renders the quiz application.
- `public/`: Contains public assets such as images and fonts.
- `package.json`: Defines the project dependencies and scripts.
- `postcss.config.js`: Configuration file for PostCSS.
- `tailwind.config.js`: Configuration file for Tailwind CSS.

## Technologies Used

The project utilizes the following technologies and libraries:

- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **React**: A JavaScript library for building user interfaces.
- **Supabase**: An open-source alternative to Firebase that provides a backend as a service.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.
- **react-markdown**: A React component for rendering Markdown content.
- **remark-math**: A remark plugin for parsing math equations in Markdown.
- **rehype-katex**: A rehype plugin for rendering math equations using KaTeX.
- **KaTeX**: A fast and easy-to-use JavaScript library for typesetting math equations.

## Setup and Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/your-username/quiz-app.git
   ```

2. Navigate to the project directory:

   ```shell
   cd quiz-app
   ```

3. Install the project dependencies:

   ```shell
   npm install
   ```

4. Set up the environment variables (see the [Configuration](#configuration) section for more details).

## Configuration

The project requires certain environment variables to be set up. Create a `.env.local` file in the root directory of the project and add the following variables:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace `your-supabase-url` and `your-supabase-anon-key` with the appropriate values from your Supabase project.

## Running the Application

To run the application locally, use the following command:

```shell
npm run dev
```

This will start the development server, and you can access the application at `http://localhost:3000`.

## Deployment

The application can be easily deployed to Vercel, a platform for deploying Next.js applications. To deploy the application, follow these steps:

1. Sign up for a Vercel account at https://vercel.com.
2. Install the Vercel CLI:

   ```shell
   npm install -g vercel
   ```

3. Login to your Vercel account:

   ```shell
   vercel login
   ```

4. Deploy the application:

   ```shell
   vercel
   ```

   Follow the prompts to configure your deployment settings.

5. Once the deployment is complete, you will receive a URL where your application is accessible.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository, explaining your changes in detail.

Please ensure that your code follows the project's coding conventions and that you have tested your changes thoroughly before submitting a pull request.

If you have any questions or need further assistance, feel free to reach out to the project maintainers.

Happy quizzing!
