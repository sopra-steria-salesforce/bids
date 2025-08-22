# Setup Repo

This documentation is for when you want to setup a new repo. Either because you want another package or because this is a brand new project 🎉

1. On the [salesforce-dx-template](https://github.com/sopra-steria-salesforce/salesforce-dx-template) main page, click `Use this template` and give your repo a name
    - Do _**not**_ copy branches
1. From now on, all changes described are to be done on the new repo you just created
1. Go to `Settings` → `Collaborators and teams`
    - Add whoever needs access.
1. Add secrets and variables
    - Secrets and variables can be added globally (GitHub org settings), in a specific repo (repo settings) or using environments. Unsure? Repo settings is a safe bet.
    - In org or repo settings → `Secrets and Variables` → `Actions`
    - Add the needed secrets and variables (see [Variables](#variables) and [Secrets](#secrets) below)
1. Initialise repo
    - **Make sure all secrets are added before this step!**
    - The last step! This step will automatically set labels, settings, rulesets, environments, create first GitHub release, Salesforce Unlocked Package and create preprod branch
    - On your new repo → `Actions` tab → `Show more workflows...` → `[X] Initialise/Update Repo` → `Run workflow`
    - Ensure the job runs successfully. You can retry or re-run the job safely if something failed.
1. Your repo should now be done! 🎉
    - Go to thw main page of your new repo, and look for the header `Making Changes and Deployment` for further instructions.

# Variables

<!-- prettier-ignore -->
| Name | Description | Required? |
| ---- | ----------- | --------- |
| `SF_PROD_USERNAME`<br>`SF_PROD_INSTANCE_URL`<br>`SF_PREPROD_USERNAME`<br>`SF_PREPROD_INSTANCE_URL`<br>`SF_SIT_USERNAME`<br>`SF_SIT_INSTANCE_URL` | See [Create SF CLI Integration User](#create-sf-cli-integration-user) | ✅ |
| `SF_SLACK_ENABLED` | Set this value to `true`/`false` | ✅ |
| `SF_SLACK_DEPLOYMENT_CHANNEL_ID`<br>`SF_SLACK_RELEASE_CHANNEL_ID`<br>`SF_SLACK_REVIEW_CHANNEL_ID`<br>`SF_SLACK_SYNC_CHANNEL_ID` | See [Create Slack Channels](#create-slack-channels) | 🙅 No |
| `SF_JIRA_URL` | The URL to the Jira instance, e.g., `https://COMPANY.atlassian.net` | 🙅 Nope |

## Create SF CLI Integration User

You will need one dedicated user in every Salesforce instance to deploy on behalf of every developer. This is an integration user with enough access in production (or preprod) to deploy metadata through the Metadata API. It should not have any unecessary access not needed or even access to the GUI, to reduce the impact if the credentials to the user should be leaked. It won't even have a password, just a private key needed to be able to login into the user.

1. Open Production → Setup → Users → `New User`
    - **First Name**: `SF CLI`
    - **Last Name**: `INTEGRATION USER`
    - **Email**: your own
    - **Username**: `SF.CLI.INTEGRATION.USER@company.no`
    - **Profile**: `System Administrator`
    - Click `Save`
1. Create a new permission set named `sf_cli_integration_user`
    - With the following System Permissions:
        - `API Enabled`
        - `Api Only User`
        - `Create and Update Second-Generation Packages`
        - `Delete Second-Generation Packages`
        - `Modify Metadata Through Metadata API Functions`
    - With the following Object Settings: (PRODUCTION ONLY)
        - `Active Scratch Orgs`: `modify all`
        - `Scratch Org Infos`: `modify all`
1. Assign the permission set to the new integration user
1. Add Variables in GitHub
    - Add the username of the new user (`SF_XXX_USERNAME`)
    - Add the instance url of the instance (`SF_XXX_INSTANCE_URL`).
    - Typically `https://COMPANY.my.salesforce.com` or `https://COMPANY--preprod.sandbox.my.salesforce.com`
1. Do the same for preprod and SIT

## Create Slack Channels

1. Create the following channels in Slack:
    - `salesforce-github-reviews`
    - `salesforce-deployment-log`
    - `salesforce-sync-log`
    - `salesforce-releases`
1. For each channel, right-click it and click `View channel details`
    - Scroll to the bottom and copy the `Channel ID`
    - Save the `Channel ID` for each channel into the four variables needed.

# Secrets

<!-- prettier-ignore -->
| Name | Description | Required? |
| ---- | ----------- | --------- |
| `SF_PACKAGE_KEY`| Can be whatever you want.<br>But it's a password every developer needs to remember. | ✅ |
| `SF_GITHUB_BOT_APP_ID`<br>`SF_GITHUB_BOT_PRIVATE_KEY` | See [Create GitHub App](#create-github-app) | ✅ |
| `SF_PROD_CLIENT_ID`<br>`SF_PROD_CLIENT_SECRET`<br>`SF_PROD_PRIVATE_KEY`<br>`SF_PREPROD_CLIENT_ID`<br>`SF_PREPROD_PRIVATE_KEY`<br>`SF_SIT_CLIENT_ID`<br>`SF_SIT_PRIVATE_KEY` | See [Create SF CLI Connected App](#create-sf-cli-connected-app) | ✅ |
| `SF_JIRA_ACCESS_TOKEN` | See [Jira Integration](#jira-integration) | 🙅 Nah girl |
| `SF_SLACK_BOT_TOKEN` | See [Slack Integration](#slack-integration) | 🙅 Hell nah |

## Create GitHub App

1. Open the GitHub org settings → `Developer settings` → `GitHub Apps` → `New GitHub app`
1. Give it a unique name
1. `Homepage URL`: `https://localhost` (or the url to the GitHub org, doesn't matter)
1. `Webhook Active`: uncheck this
1. Repository permissions
    - `Actions`: Read and write
    - `Administration`: Read and write
    - `Contents`: Read and write
    - `Pull requests`: Read and write
    - `Variables`: Read and write
1. Organization permissions:
    - `Members`: Read-only
1. Click `Create GitHub app`
1. Store the `App ID` as the secret `SF_GITHUB_BOT_APP_ID`
1. Scroll to the bottom → Click `Generate a private key` → A file will be downloaded
    - Open the file (e.g., in VS Code)
    - The content inside the file should be stored as the secret `SF_GITHUB_BOT_PRIVATE_KEY`
    - Copy everything in the file to the secret, including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`
1. Click `Install App` → choose either all repositories (or just the ones you need it on)

## Create SF CLI Connected App

To be able to login in to the created SF CLI integration user, you'll need to create a certificate and a connected app.

### Create Certificate:

You'll need either:

-   macOS
-   Linux on Windows with WSL
-   Find online whetever you need to do on Windows to make certificates
-   Ask a friend

Run the following code 3x times using:

-   **ENV**: `PROD`
-   **ENV**: `PREPROD`
-   **ENV**: `SIT`

```shell
ENV="CHANGE_ME" # remember to change to eother PROD, PREPROD or SIT
NAME="COMPANY NAME"
CITY="YOUR CITY"
EMAIL="YOUR_EMAIL@COMPANY.NO"

PASSWORD=$(openssl rand -base64 70 | sed -E 's/(.)\1+/\1/g') # you'll need a random password, but you don't need to store it anywhere
mkdir -p ~/Desktop/tmp && mkdir -p ~/Desktop/certificates
openssl genpkey -des3 -algorithm RSA -pass pass:$PASSWORD -out ~/Desktop/tmp/${ENV}.pass.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -passin pass:$PASSWORD -in ~/Desktop/tmp/$ENV.pass.key -out ~/Desktop/certificates/$ENV.private.key
openssl req -new -key ~/Desktop/certificates/$ENV.private.key -out ~/Desktop/tmp/$ENV.csr -subj "/CN=NO/emailAddress=$EMAIL/C=NO/ST=$CITY/L=$CITY/O=$NAME/OU=$NAME"
openssl x509 -req -sha256 -days 365 -in ~/Desktop/tmp/$ENV.csr -signkey ~/Desktop/certificates/$ENV.private.key -out ~/Desktop/certificates/$ENV.public.crt

open ~/Desktop/certificates
```

Then open the following file in VS Code:

-   Open `PROD.private.key`, `PREPROD.private.key` and `SIT.private.key`
-   Copy the text and then save it in the GitHub secret as `SF_PROD_PRIVATE_KEY`, `SF_PREPROD_PRIVATE_KEY` and `SF_SIT_PRIVATE_KEY`

### Create Connected App

1. Open Production → Setup → App Manager → Click `New Connected App`
    - **Name**: `sf_cli`
    - **API Name**: `sf_cli`
    - **Contact Email**: your own, but it's never used for anything
    - **Enable OAuth Settings**: ✅
    - **Callback URL**: `http://localhost:1717/OauthRedirect`
    - **Use digital signatures**: upload the `XXX.public.crt` file (PROD, PREPROD or SIT)
    - **Selected OAuth Scopes**:
        - `Manage user data via APIs (api)`
        - `Manage user data via Web browsers (web)`
        - `Perform requests at any time (refresh_token, offline_access)`
    - Click `Save`
1. Click Manage Consumer Details
    - Copy the `Consumer Key` and store it as the GitHub secret `SF_XXX_CLIENT_ID`
    - PRODUCTION ONLY: Copy the `Consumer Secret` and store it as the GitHub secret `SF_XXX_CLIENT_SECRET`
1. Click `Back to Manage Connected Apps` → Click `Manage` → Click `Edit Policies`
    - **Permitted users**: `Admin approved users are pre-authorized`
    - **Refresh Token Policy**: set `Expire refresh token after` to 90 days
    - **Timeout Value**: `15 minutes`
    - Click `Save`
1. Open the permission set `sf_cli` you previously created
    - Click `Assigned Connected Apps` → Edit → Add the newly created connected app `sf_cli`
1. Do everything again, but for `preprod` and `sit`

## Jira Integration

See [Manage API tokens for your Atlassian account](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/) for how to create an API token. This token (together with your username) will be stored as the secret `SF_JIRA_ACCESS_TOKEN` --> `username:token`

Example : `SF_JIRA_ACCESS_TOKEN` : `john.foreland@soprasteria.com:ATATT3xFfGF0sSZOGXfSJRdZI1a4W_NoP1uev`

## Slack Integration

By adding an API token for Slack, you'll get deployment logs/errors, release notes and code reviews posted to Slack automatically.

1. Go to [api.slack.com](https://api.slack.com/apps)
1. Click `Create New App` → `From an app manifest` → Choose a Slack workspace
1. Copy & paste the JSON below into the input field (replace everything already there) → `Next` → `Create`
1. Click `Install to Workspace` → Add the four channels you just created → `Allow`
1. Add a cute logo to the bot, if you want to
1. Go to `OAuth & Permissions` → Press `Copy` on the `Bot User OAuth Token`
    - This will be the secret `SF_SLACK_BOT_TOKEN`

#### App Manifest to Copy/Paste:

<!-- prettier-ignore -->
```json
{
    "display_information": {
        "name": "Salesforce Bot",
        "description": "Jeg poster oppdateringer om Salesforce",
        "background_color": "#3854a1"
    },
    "features": {
        "bot_user": {
            "display_name": "Salesforce Bot",
            "always_online": false
        }
    },
    "oauth_config": {
        "scopes": {
            "bot": [
                "channels:history",
                "chat:write",
                "chat:write.customize",
                "groups:history",
                "im:history",
                "incoming-webhook",
                "mpim:history",
                "reactions:write"
            ]
        }
    },
    "settings": {
        "interactivity": {
            "is_enabled": false
        },
        "org_deploy_enabled": false,
        "socket_mode_enabled": false,
        "token_rotation_enabled": false
    }
}
```
