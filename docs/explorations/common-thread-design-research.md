# COMMON THREAD Preview Research

These are paired explorations, not a final selection. Both use the same approved copy, white T-shirt asset, $28 fictional demo price, S/M/L/XL sizes, lifestyle photo, and `public/shop.js` interaction. Historical works are cited as references; their images and compositions are not reproduced.

## Shared lifestyle image

Priscilla du Preez, “people laughing and talking outside during daytime,” published 6 April 2017, [Unsplash photo page](https://unsplash.com/photos/people-laughing-and-talking-outside-during-daytime-nF8xhLMmg0c). The page states the photo is free to use under the Unsplash License. The image shows several people talking and laughing outdoors in natural light. The same locally bundled image is used in both previews at `public/explorations/assets/lifestyle-priscilla-du-preez.jpg`.

## Modernist

### References viewed

- Edward McKnight Kauffer, _Drawing_, 1934, V&A object E.3770-2004. [V&A, What was Modernism?](https://www.vam.ac.uk/articles/what-was-modernism). The image shows a black geometric figure and spiral on a pale ground. Borrow high contrast, simple forms, and purposeful negative space, not the drawing's figure or composition.
- Christian Dell, _Dell-Lampe Type K_, desk lamp, 1929, made by Zimmermann GmbH, V&A object M.27-1992. [V&A, What was Modernism?](https://www.vam.ac.uk/articles/what-was-modernism). The image shows a black task lamp with a clear shade, support, joints, and base. Borrow visible function and deliberate structure, not the lamp's form.

### Preview decisions

- A two-column grid aligns the headline, photo, product, and details.
- DM Sans carries the headline and controls; Lora remains an accent.
- Thin rules, measured spacing, and restrained Sage accents keep price and sizes easy to scan.

**Intended audience effect:** The learner predicts that hierarchy and function may make the brand feel approachable and dependable and clarify the offer without overwhelming the customer.

**Risk:** The restrained structure could feel generic and underplay individuality.

Preview: [Modernist](../../public/explorations/modernist.html) (local URL: `http://127.0.0.1:5175/explorations/modernist.html`).

## Postmodernist

### References viewed

- Ron Arad, _Concrete Stereo_ (stereo system set in concrete), 1983, V&A object W.7-2011. [V&A, What is Postmodernism?](https://www.vam.ac.uk/articles/what-is-postmodernism). The image juxtaposes audio components with rough concrete blocks. Borrow material contrast and juxtaposition, not the object or its image.
- Martine Bedin (for Memphis), _Super lamp prototype_, 1981, made by Fausto Celati, V&A object M.1-2011. [V&A, What is Postmodernism?](https://www.vam.ac.uk/articles/what-is-postmodernism). The image combines a wheeled blue body with repeated colored bulb sockets. Borrow playful repetition and asymmetry, not the lamp's shape.

### Preview decisions

- An offset image frame and overlapping geometric color planes create asymmetry.
- DM Sans and Lora mix typographic voices while all marketing copy remains identical to the Modernist version.
- Repeated shapes and Sage/Sand blocks add play without changing the product, photo, or controls.

**Intended audience effect:** The learner predicts that play may communicate individuality and creativity more strongly.

**Risk:** The learner predicts layering and visual contrast could feel too busy or less universally approachable.

Preview: [Postmodernist](../../public/explorations/postmodernist.html) (local URL: `http://127.0.0.1:5175/explorations/postmodernist.html`).

### Accessibility note

The initial shared Sage focus outline measured approximately 2.02:1 against the Postmodernist Sand header. The Postmodernist header links and size-control focus-within state now use the approved Charcoal token on Sand. The Modernist rules remain unchanged. `tests/browser/studio.spec.js` verifies the computed focus color for a keyboard-focused header link and size option.

## Comparison and selection

Inspect both renders at matching desktop and narrow/mobile widths. Confirm identical copy, product image, lifestyle image, price, sizes, and interaction; check that intended fonts/images load and the controls are readable, keyboard-operable, and free of horizontal overflow.

- Direction to keep or adjust: Not chosen yet.
- Visible detail that supports the choice: Not chosen yet.
- Reason connected to The Everyday Individual: Not chosen yet.
- Requested adjustment before selection: Not chosen yet.
