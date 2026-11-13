// Thematic ASCII art shown beside each page's heading (partials/art.njk), keyed by page_key.
// Home has the animated heart (assets/heart.js) and the CV page deliberately has none.
const art = {
    semester: String.raw`
    |                        |
 .--+------------------------+--.
 |  o                        o  |
 |==============================|
 |  x   x   x   x   x   x   x   |
 |  x   x   x   x   x   x   x   |
 |  x   x   x   x  [ ]  .   .   |
 |  .   .   .   .   .   .   .   |
 |  .   .   .   .   .   .   .   |
 '------------------------------'`,

    "job-pay": String.raw`
  .--------------------------------.
  | 1000                      1000 |
  |      .------.                  |
  |     (  Kč   )   ~~~~~~~~~~     |
  |      '------'   ~~~~~~~~~~     |
  | 1000                      1000 |
  '--------------------------------'
        _______
     .-'       '-.
    (     Kč      )
    |'-._______.-'|
    (     Kč      )
    |'-._______.-'|
    (     Kč      )
     '-._______.-'`,

    uses: String.raw`
    .------------------------------.
    |  .------------------------.  |
    |  | $ uname -sr            |  |
    |  | Linux 7.2.15-arch1-1   |  |
    |  | $ make it work_        |  |
    |  |                        |  |
    |  '------------------------'  |
    '------------------------------'
   /  ============================  \
  /  ==============================  \
 /             [________]             \
'--------------------------------------'`,

    privacy: String.raw`
         .---------.
        / .-------. \
       / /         \ \
       | |         | |
    ___|_|_________|_|___
   |                     |
   |         ___         |
   |        (   )        |
   |         | |         |
   |         |_|         |
   |                     |
   |_____________________|`,

    404: String.raw`
       ________
      |        |____
  ====|        |____         .----------.
      |________|             |          |
                    ~  ~     |   o  o   |
                             |          |
                             '----------'`,
};

// Each piece starts with a newline only so the source lines up; drop it.
export default Object.fromEntries(Object.entries(art).map(([k, v]) => [k, v.replace(/^\n/, "")]));
