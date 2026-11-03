/*
  The journey told by the 3D story that follows the "Get ready for the
  HACKVERSE" headline. One entry per stop on the path, in order.

  track   which half of the event the stop belongs to
  title   the stop's name (shown as the heading)
  copy    one short line under the heading
  chips   up to three small tags
  figure  optional large number shown under the copy (last stop only)

  The copy is deliberately general: it only repeats what the rest of the site
  already says about ZENITH '26. Edit freely once the programme is confirmed.
*/
export const storyChapters = [
  {
    track: 'Community Day',
    title: 'AWS Student Community Day',
    copy: 'Where the journey starts. Meet other student builders, learn about the cloud and get ready to build.',
    chips: ['Community', 'Cloud', 'Learn'],
  },
  {
    track: 'Community Day',
    title: 'AWS Discussion Panels',
    copy: 'Industry voices and student builders talk about careers, cloud and where technology is heading.',
    chips: ['Panel', 'Industry voices'],
  },
  {
    track: 'Community Day',
    title: 'AWS Speaker Sessions',
    copy: 'Expert talks and hands-on sessions on AI, ML, cloud computing and data engineering.',
    chips: ['AI', 'ML', 'Cloud'],
  },
  {
    track: 'Community Day',
    title: 'AWS Goodies & Swags',
    copy: 'Take home AWS goodies and swag from the community day.',
    chips: ['Goodies', 'Swag'],
  },
  {
    track: 'Hackathon',
    title: '2-Day National Level Hackathon',
    copy: 'Teams from across the country come together for two days of building.',
    chips: ['2 days', 'National level'],
  },
  {
    track: 'Hackathon',
    title: 'Ideation',
    copy: 'Pick a problem statement, shape the idea and decide what the team will build.',
    chips: ['Problem statement', 'Plan'],
  },
  {
    track: 'Hackathon',
    title: 'Prototyping',
    copy: 'Turn the idea into something that runs. Design, code and iterate fast.',
    chips: ['Build', 'Iterate'],
  },
  {
    track: 'Hackathon',
    title: 'Deployment',
    copy: 'Ship it. Put the prototype online so the jury can use it, not only read about it.',
    chips: ['Ship', 'Live demo'],
  },
  {
    track: 'Hackathon',
    title: 'Evaluation / Jury',
    copy: 'A jury looks at every team’s project and picks the winners.',
    chips: ['Jury', 'Demo'],
  },
  {
    track: 'Hackathon',
    title: 'Prize Pool Worth ₹1.5 Lac',
    copy: 'The teams that stand out take home a share of the prize pool.',
    chips: ['Winners', 'Certificates'],
    figure: '₹1.5 Lac',
  },
]

/*
  The camera rides on past the last stop, under the winners' arch to the trophy. The page's scroll
  progress (0 to 1) covers the whole road plus this extra run-out, as a fraction of the road's length.
*/
export const PATH_OVERRUN = 0.2

