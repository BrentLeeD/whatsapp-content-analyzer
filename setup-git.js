const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function setupGitRepository() {
    try {
        // Check if git is installed
        execSync('git --version', { stdio: 'ignore' });
    } catch (error) {
        console.error('Git is not installed. Please install Git from https://git-scm.com/downloads');
        return;
    }

    try {
        // Initialize git repository
        execSync('git init', { stdio: 'inherit' });
        
        // Create .gitignore
        const gitignoreContent = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*`;

        fs.writeFileSync('.gitignore', gitignoreContent);

        // Stage all files
        execSync('git add .', { stdio: 'inherit' });

        // Commit files
        execSync('git commit -m "Initial commit of WhatsApp Content Analyzer"', { stdio: 'inherit' });

        console.log('Git repository initialized successfully!');
    } catch (error) {
        console.error('Error setting up git repository:', error);
    }
}

function configureRemoteRepository(username, repoName) {
    try {
        // Set the remote repository URL
        execSync(`git remote add origin https://github.com/${username}/${repoName}.git`, { stdio: 'inherit' });
        
        // Rename main branch
        execSync('git branch -M main', { stdio: 'inherit' });

        console.log(`Remote repository configured for https://github.com/${username}/${repoName}.git`);
        console.log('You can now push your code using "git push -u origin main"');
    } catch (error) {
        console.error('Error configuring remote repository:', error);
    }
}

// Usage
setupGitRepository();

// Uncomment and replace with your GitHub username and repository name when ready to set remote
// configureRemoteRepository('YOUR_GITHUB_USERNAME', 'whatsapp-content-analyzer');