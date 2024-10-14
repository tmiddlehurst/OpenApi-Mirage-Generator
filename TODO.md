If mirage directory already exists in project, inject config into current config

Publish
https://cameronnokes.com/blog/the-30-second-guide-to-publishing-a-typescript-package-to-npm/
https://dev.to/brense/publishing-a-nodejs-cli-tool-to-npm-5f2m

List type of model CLI options?

extend mirage generator to create uri type strings if string has format: uri

Implement isCyclic?

Add baseURL to config based on
servers:

- url: http://petstore.swagger.io/api

Should we have the CLI option to chose models?

Support multiple input schemas

It have an in-repo or as-package option.

### in-repo

generates a directory for use immediately in a project, it creates/updates:

- a server.ts definition file
- a /generated directory with:
  - generated factories
  - generated handler return bodies and headers?
  - a models.ts definition file
  - a factories.ts definition file
- a /factories directory with factories which export a generated factory (for the purpose of extension);
- a /handlers directory with handlers which export a generated handler which returns a generated body and header object (for the purpose of extension);

### as-package

generates everything from the above /generated directory, allowing you to import it where necessary

### interative cli mode vs CI mode with flags

we want to be able to run this in CI and not need human responses to prompts
