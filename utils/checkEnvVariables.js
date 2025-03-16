/**
 * Utility function to check the presence of required environment variables.
 * @param {Array} variables - List of environment variables to check.
 */
function checkEnvVariables(variables) {
    const missingVariables = variables.filter(v => !process.env[v]);

    if (missingVariables.length > 0) {
        console.error(`Missing environment variables: ${missingVariables.join(', ')}`);
        process.exit(1);
    }
}

module.exports = { checkEnvVariables };