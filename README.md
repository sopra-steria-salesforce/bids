# salesforce-dx-template

A Salesforce DX template containing helpful stuff to initialise new projects, and containing GitHub workflows for easier deployment.

# 🧑‍💻 Setup

See [docs/devops](docs/devops) for instructions on how to setup this template in a new repo.

# 🤓 Develop

After all setup is done in the previous step, you're ready to develop!

You can now (typically):

-   Create feature branches and create PR's
-   This requires validation and code reviews, to ensure quality and safety before deploying to production
-   New changes merged to `main` are automatically deployed to preprod
-   After a quick validation in preprod, you're good to go and can easily deploy to production 🎉

## First-time Install

Make sure you've performed the steps in [Local Setup](docs/devops/local-setup.md) before trying to create a Scratch Org.

## Clone Repo

1. Open the repo in your browser
1. Click `Code` → `Open with GitHub Desktop`
1. Save the repo somewhere on your computer
    - _**Avoid cloud-synced folders!**_
    - On Windows, the `Documents` folder is synced to OneDrive and will cause issues later!
1. In GitHub Desktop, click `Repository` → `Open in X`
    - Depending on your system you can have X = `Command Line`, `Git Bash` og `Terminal`
1. Once opened, type and run `npm install`
    - This will install all necessary software for you, including code formatting.

## Make Changes

1. In GitHub Desktop, click `Repository` → `Open in X`
    - Depending on your system you can have X = `Command Line`, `Git Bash` og `Terminal`
1. Run `npm run scratch:create`
    - Now, a fully functioning copy of production (without data) will be created for you.
1. Make your changes inside the Scratch Org
1. Run `npm run scratch:pull` to add the changes from the Scratch Org to your local computer
1. Commit & Push the changes inside GitHub Desktop
1. Create a Pull Request
    - To `main` or `preprod`, depending on use case
    - Get the changes validated successfully
    - If Slack Integration is working, a post is added for others to code review your changes. Otherwhise, get someone to approve it.
1. Merge the PR
1. Check the package creation status in the `Actions` tab
1. Once the package is done, check it in the `Code` tab → `Releases`
1. Click `Deploy` on the release you want to deploy to production
    - Click `Run Workflow`
    - Keep `Branch: main` if you want to deploy the latest package.
    - If you want a specific package, click the dropdown → `Tags` → Choose the version
    - Finally, click `Run workflow` again to deploy
    - Wait a couple of seconds, and a new entry should appear in the list. You can open it to view the progress of the deployment.

# Template Updates

You can easily merge in new changes from the template

1. `git remote add template https://github.com/sopra-steria-salesforce/salesforce-dx-template`
1. `git fetch --all`
1. `git merge template/main --allow-unrelated-histories`

# 😴 Licensing

See [LICENSE](LICENSE), or summarised:

## Permissions

You're allowed to use this template:

-   For commercial use
-   For private use
-   To distribute it
-   To modify it

## Conditions

You must specify proper copyright notices. That means, somewhere in your code (e.g., the `LICENSE` file or the readme), you must link to this repository.

## Limitations

The author of this template refrains from any liability or warranty on the use of this template.
