# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

After cloning the repository to your local directory:

### `npm install`
You need to run this command in two directories. Firstly run this command in the root directory. Then
cd into /firebase/functions directory and run this command the second time.

### `npm start`
This command will start the react app on localhost:3000

### `npm run build`
This command will build the current react app. You must run this command before deploy hosting; otherwise,
your changes will not be reflected in the hosting website.

### `firebase deploy --only functions`
After writing a new function, run this command to deploy the function to firebase (It will take some time)

### `firebase deploy --only hosting`
After writing a new function or changing the frontend and you want your change to be shown in our real website
, run this command to deploy your changes.

### `firebase deploy`
This command deploys all your existing changes。

## How To Make Code Changes
#### Switch to master branch, do `git pull` to make sure you have the latest version of master branch.
#### Create a local branch `git branch xxx`. Make sure that the name can well describe your change.
#### Write your code in the local branch.
#### Do `git add xxx` after all changes are done. If you want to use `git add .`, make sure you do `git status` in the first place to avoid adding unwanted files. Then do `git commit -m "some meaningful message"` to commit your changes.
#### Do `git push origin your-branch-name` to push the code change to remote branch.
#### Create a pull request on the GitHub page. Merge the PR after making sure there is no conflict.
