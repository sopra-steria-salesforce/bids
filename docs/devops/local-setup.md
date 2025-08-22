# Local Setup

This documentation will help you setup tools and software needed to run Salesforce DX locally and to create Scratch Orgs.

## Windows

Open PowerShell and run:

```powershell
# Install fnm (fast node manager)
winget install Schniz.fnm
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
fnm env --use-on-cd | Out-String | Invoke-Expression

# install node 20
fnm use --install-if-missing 20

winget install -e --id GitHub.GitHubDesktop
winget install -e --id Microsoft.VisualStudioCode
winget install -e --id EclipseAdoptium.Temurin.17.JDK
winget install -e --id Git.Git
$CurrentPATH = ([Environment]::GetEnvironmentVariable("PATH")).Split(";")
$NewPATH = ($CurrentPATH + "C:\Program Files\git\bin") -Join ";"
[Environment]::SetEnvironmentVariable("PATH", $NewPath, [EnvironmentVariableTarget]::Machine)
npm install --global @salesforce/cli
```

## macOS

1. Open terminal and run `xcode-select --install` first (Xcode install will open, install this before continuing):
1. Run the code below:

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
echo "export PATH=/opt/homebrew/bin:$PATH" >> ~/.bash_profile && source ~/.bash_profile

brew install node@20
brew install --cask github
brew install --cask visual-studio-code
brew tap homebrew/cask-versions
brew install --cask temurin17
npm install --global @salesforce/cli
```
