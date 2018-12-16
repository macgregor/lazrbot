# Lazrbot
Discord bot for the Lazrcats Discord server.


## Setup

### OSX
[Install Homebrew](https://brew.sh/), then:
```
brew install node
npm install discord.io winston --save
```


## Run
`node lazrbot.js`


## Invite Bot to Server
`https://discordapp.com/oauth2/authorize?&client_id=523893952575963156&scope=bot&permissions=0`

Note: the bot does not have to be up and running to invite

## Amazon EC2 CI/CD
[Deployment Guide](https://medium.com/@itsdavidthai/comprehensive-aws-ec2-deployment-with-travisci-guide-7cafa9c754fc),
though it glossed over some important things like the [appspec.yml](https://docs.aws.amazon.com/codedeploy/latest/userguide/application-revisions-appspec-file.html?icmpid=docs_acd_console) file
Firewall Rules: TCP 443 (text), UDP 50000-65535 (voice)
