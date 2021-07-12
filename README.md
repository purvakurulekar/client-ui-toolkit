# Introduction 
Set of UI Components commonly used in client UI applications

# Available components

- testAppheader : common application header

```
import { TestAppheader } from "client-ui-toolkit"
```

### Props
| Name       | type | Description |
| ---------- |:-----------:|:------------|
| isLoggedIn? | boolean | if user is logged in or not |
| onLoginStatechanged? | function | function invoked when login state changed |
| onProfileToggle? | function | function invoked when clicking on profile icon |

### example usage
```
<TestAppheader isLoggedIn={false} />
```

- loader : spinner indicating load activity

```
import { Loader } from "client-ui-toolkit";
```

### props

| Name       | type | Description |
| ---------- |:-----------:|:------------|
| width? | number | Width of loader, default 30px |
| height? | number | height of loader, default 14px |

### example usage
```
<Loader />
```

- overlay : blank semi opaque grey overlay

```
import { Overlay } from "client-ui-toolkit";
```

### example usage

```
<Overlay>
    <Loader />
</Overlay>
```

- sliding panel : component with expandable dragger

```
import { SlidingPanel, SLIDER_DIRECTION } from "client-ui-toolkit";
```
### Props
| Name       | type | Description |
| ---------- |:-----------:|:------------|
| className? | string | extra classNames |
| direction? | SLIDER_DIRECTION | which direction the slider will slide |
| initialDimension? | number | initial dimension of the slider panel
| configKey? | string | use a custom configuration key to store resized position |

## Enums
| Key       | values |
| ---------- |:------|
| SLIDER_DIRECTION | |
| | `vertical` |
| | `horizontal` |

# example usage
```
<SlidingPanel direction={SLIDER_DIRECTION.vertical}>
    <div>Hello World!</div>
</SlidingPanel>
```

- pcs sniffer : component used to sniff PCS traffic

```
import { PCSSniffer } from "client-ui-toolkit";
```

### example usage
```
<PCSSniffer />
```