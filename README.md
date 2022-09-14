# nleaf.js

A Wrapper for the Nanoleaf Open API with Typescript support

**NOTE:** This has only been tested on my Nanoleaf Shapes and i cannot confirm this will work on other devices as well

## Install

```bash
npm i nleaf.js
```

## 1 Features
- [x] Authorization
- [x] General Panel Info and State
- [x] Effects Control *(-- NEEDS MORE TESTING --)*
- [x] Real-Time Touch Data
- [ ] Events
- [x] Discovery

## 2 Examples

### 2.1 Simple Client

```typescript

import { Nanoleaf } from "nleaf.js";

const device = new Nanoleaf({
    host: "192.168.1.100",
    accessToken: "abcdefghijklmnopqrstuvwxyz012345"
});

(async () => {
    /// Set color of all panels ///
    await device.setHSB(215, 81, 82); // Set all panels to a blue-ish color

    /// Panel Layout ///
    let layout = await device.layout();
    console.log(layout);

})();

```

### 2.2 Discovery

```typescript

import { Nanoleaf } from "nleaf.js";

// This will be called when a device is discovered
Nanoleaf.discovery.onDiscovered = function(res) {
    console.log("Discovered a Nanoleaf Device:", res);
};

Nanoleaf.discovery.start();

// Nanoleaf.discovery.stop()
// Can be used to stop the search
```

### 2.3 Live Touch Data

This example shows how to get live touch data from the panels

```typescript
import { Nanoleaf } from "nleaf.js";

const device = new Nanoleaf({
    host: "192.168.1.100",
    accessToken: "abcdefghijklmnopqrstuvwxyz012345",

    touch: {
        enabled: true
    }
});

device.on("touch", (event) => {
    console.log("Touch Event:", event);
})
```

### 2.4 Authorization

```typescript
import { Nanoleaf } from "nleaf.js";

let token = Nanoleaf.auth.getToken("http://192.168.1.100/");
console.log(token);
```

## 3 Client Options

Option | Type | Optional | Default | Description
--- | --- | --- | --- | ---
host | *string* | no | - | IP Address of the Device
accessToken | *string* | no | - | Access Token to the Device
port | *number* | yes | 16021 | API Port
version | *string* | yes | v1 | API Version
touch | *object* | yes | {} | Live Touch Data Options
touch.enabled | *boolean* | yes | false | Live Touch Data enabled?
touch.port | *number* | yes | 35508 | UDP Touch Server port on **localhost**