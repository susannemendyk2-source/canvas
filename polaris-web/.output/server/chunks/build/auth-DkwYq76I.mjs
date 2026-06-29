import { e as defineNuxtRouteMiddleware } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@vue/shared';
import 'axios';

const auth = defineNuxtRouteMiddleware((to) => {
});

export { auth as default };
//# sourceMappingURL=auth-DkwYq76I.mjs.map
