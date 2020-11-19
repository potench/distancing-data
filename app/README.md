<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<p align="center">
  <a href="https://www.gatsbyjs.org">
    <img alt="Gatsby" src="https://www.gatsbyjs.org/monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  https://www.distancingdata.org
</h1>

## 🚀 Quick start

1.  **Start developing.**

    1. cd into frontend folder `Openmail/frontend/` and run `yarn` - this will build all the packages in the
       frontend folder. - Don't sweat it for now if you see some failures on your machine in this step.
    2. cd into this folder `Openmail/frontend/packages/distancing-data`
    3. run `yarn dev` to start the dev server and visit `http://localhost:8000` to see the app. (if you're not in the
       office, make sure you're on the VPN so that the local app can pull data from wordpress).
    4. NOTE: you can force an experiment by experiment_id like so: `http://localhost:8000/?exp=v5-alt`

## 💫 Deploy (Prod | Stage | Dev)

prod: https://www.distancingdata.org

NOTE: you will need to configure AWS access keys for s1-layout AWS account

to your local ~/.aws/credentials

### Dev

- Run `yarn deploy:dev`, confirm `y` for the s3 deploy step, and your site will be live on `http://dan-sp-test-1.com`.
- To shortcut the `y` step, you can just run `yarn deploy:dev -y`

### Stage

- Run `yarn deploy:stage`, confirm `y` for the s3 deploy step, and your site will be live on `http://stage.distancingdata.com`.
- To shortcut the `y` step, you can just run `yarn deploy:stage -y`

### Prod

- Run `yarn deploy:prod`, confirm `y` for the s3 deploy step, and your site will be live on `https://distancingdata.com`.
- To shortcut the `y` step, you can just run `yarn deploy:prod -y`

<!-- AUTO-GENERATED-CONTENT:END -->
