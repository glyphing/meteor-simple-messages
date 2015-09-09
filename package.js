Package.describe({
  name: 'gly:simple-messages',
  summary: 'A package to display simple messages to the user',
  version: '0.1.0',
  git: 'https://github.com/glyphing/meteor-simple-messages.git'
});

Package.onUse(function(api) {
  api.versionsFrom('0.9.0');
  api.use(['minimongo', 'mongo-livedata', 'templating'], 'client');
  api.addFiles(['messages.js', 'messages.html'], 'client');

  if (api.export) {
    api.export(['SimpleMessages', 'simpleMessages'], 'client');
  }
});
