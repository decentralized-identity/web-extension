
import { Browser } from '/extension/js/modules/browser.js';

globalThis.tabData = await Browser.content.getTabData();