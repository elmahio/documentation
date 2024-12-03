---
title: How to enable two-factor login
description: elmah.io supports two-factor login through either one of the social providers or two-factor apps like Authenticator or Authy. Learn how it works.
---

# How to enable two-factor login

[TOC]

elmah.io supports two-factor login through either one of the social providers or a two-factor app like Google Authenticator or Authy.

## Two-factor with an elmah.io username and password

When signing into elmah.io with a username and password, two-factor authentication can be enabled on the Security tab on your profile:

![Enable two-factor](images/enable-two-factor.png)

Follow the instructions on the page to install either Google Authenticator or Authy. Once you have the app installed, scan the on-screen QR code and input the generated token in the field in step 3.

Once two-factor authentication has been successfully set up, the following screen is shown:

![Two-factor enabled](images/two-factor-enabled.png)

Two-factor authentication can be disabled at any time by inputting a new code from the authenticator app in the text field and clicking the *Deactivate two-factor login* button.

We recommend that you sign out after enabling two-factor authentication to invalidate the current session.

!!! tip
    Popular authenticator apps like Google Authenticator and Microsoft Authenticator support cloud backup. Make sure to enable this in case you lose your phone. When cloud backup is enabled, you can sign in with your main account when you get a new phone and all of your stored accounts will be automatically restored.

## Two-factor with a social provider

When using one of the social providers to log in to elmah.io, two-factor authentication can be enabled through either Twitter, Facebook, Microsoft, or Google. Check out the documentation for each authentication mechanism for details on how to enable two-factor authentication.