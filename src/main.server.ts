import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/root/app';
import { config } from './app/root/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;

