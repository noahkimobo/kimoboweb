type Answer = readonly [string, readonly [string, string, string, string]]

type Category = {
  k: string
  w: number
  i: string
  tip: string
  q: readonly Answer[]
}

type CategoryScore = {
  c: Category
  p: number
}

// Set by the production build when a WhatsApp contact number is configured.
const BRAND = 'Daraja'
const WHATSAPP = ''
const CATS: readonly Category[] = [
  {
    k: 'Profile & brand',
    w: 10,
    i: '👤',
    tip: 'Rewrite your bio to say what you sell, where, and for whom. Add a working link or WhatsApp button and use a real logo as your avatar.',
    q: [
      ['Your bio clearly says what you offer, where, and who it’s for.', ['Not at all', 'Vaguely', 'Mostly', 'Crystal clear']],
      ['Your profile has a working link or contact button.', ['No link', 'Link, not tracked', 'Link that works', 'Tracked link/WhatsApp']],
      ['Your avatar and name match your brand across every platform.', ['No two match', 'Some match', 'Mostly match', 'Fully consistent']],
    ],
  },
  {
    k: 'Content',
    w: 25,
    i: '🎬',
    tip: 'Move from static posts to short video with a 2-second hook. Plan three pillars: education, proof, and offers, then reuse every project as content.',
    q: [
      ['What share of your posts are short video?', ['None', 'Under 25%', '25-60%', 'Over 60%']],
      ['Do your posts open with a strong hook in the first 2 seconds?', ['Never', 'Rarely', 'Often', 'Almost always']],
      ['You publish proof: testimonials, results, case studies.', ['Never', 'Once in a while', 'Monthly', 'Weekly']],
    ],
  },
  {
    k: 'Performance',
    w: 20,
    i: '📈',
    tip: 'Post at least 3 times a week for 30 days, then review top posts and double down on what earns saves, shares, and watch time.',
    q: [
      ['How often do you post?', ['Under once a month', 'Monthly', 'Weekly', '3+ times a week']],
      ['Your follower count over the last 90 days is…', ['Falling', 'Flat', 'Growing slowly', 'Growing steadily']],
      ['Typical post reach compared to your follower count?', ['Under 5%', '5-15%', '15-40%', 'Over 40%']],
    ],
  },
  {
    k: 'Audience',
    w: 15,
    i: '🎯',
    tip: 'Check your analytics: if followers don’t match your ideal buyer’s age, place, and interests, adjust your topics and tags to attract the right people.',
    q: [
      ['You know the age, gender, and location of your followers.', ['No idea', 'Roughly', 'Checked once', 'Reviewed monthly']],
      ['Most followers are in your target market and buyer group.', ['Few are', 'Some', 'Most', 'Nearly all']],
      ['You answer common audience questions in your content.', ['Never', 'Rarely', 'Sometimes', 'Regularly']],
    ],
  },
  {
    k: 'Conversion',
    w: 20,
    i: '💬',
    tip: 'Use one clear call to action per post, reply to every comment and DM within hours, and track leads from post to quote to sale.',
    q: [
      ['How fast do you reply to comments and DMs?', ['Days or never', 'Within a day', 'Within hours', 'Within the hour']],
      ['Every post has one clear call to action.', ['None', 'Some', 'Most', 'All']],
      ['You track where leads come from.', ['Not at all', 'Memory', 'Spreadsheet', 'CRM or tagged links']],
    ],
  },
  {
    k: 'Discoverability',
    w: 10,
    i: '🔍',
    tip: 'Put the words buyers search for (product, price, city) in captions, on-screen text, and speech. Add location tags and a few specific hashtags.',
    q: [
      ['Captions and on-screen text include keywords buyers search.', ['No', 'Sometimes', 'Often', 'Always']],
      ['You use location tags and focused hashtags.', ['Neither', 'One of them', 'Both, occasionally', 'Both, consistently']],
      ['You publish price or “how much does it cost” content.', ['Never', 'Once', 'Occasionally', 'Regularly']],
    ],
  },
]

const answers: (number | null)[][] = CATS.map(() => [null, null, null])
let step = -1
const appElement = document.getElementById('app')

if (!(appElement instanceof HTMLElement)) {
  throw new Error('Social media self-audit container was not found.')
}

const app: HTMLElement = appElement

function intro(): void {
  app.innerHTML =
    '<span class="pill">FREE · 3 MINUTES</span><h1>How healthy is your social media?</h1><p class="mut">Answer 18 quick questions across 6 areas and get your score, a breakdown, and the three fixes that will move the needle most.</p><button class="btn" data-action="start">Start the check</button>'
}

function go(nextStep: number): void {
  step = nextStep
  if (step >= CATS.length) {
    result()
  } else if (step < 0) {
    intro()
  } else {
    ask()
  }
}

function ask(): void {
  const category = CATS[step]
  const categoryAnswers = answers[step]

  if (!category || !categoryAnswers) {
    throw new Error(`Social media self-audit step ${step + 1} is unavailable.`)
  }

  let html =
    '<progress class="bar" max="' +
    CATS.length +
    '" value="' +
    step +
    '" aria-label="Assessment progress"></progress><span class="pill">' +
    (step + 1) +
    ' / ' +
    CATS.length +
    '</span><h2>' +
    category.i +
    ' ' +
    category.k +
    '</h2>'

  category.q.forEach((question, questionIndex) => {
    html += '<div class="q"><p>' + question[0] + '</p><div class="opts">'
    question[1].forEach((option, optionIndex) => {
      html +=
        '<button class="opt' +
        (categoryAnswers[questionIndex] === optionIndex ? ' on' : '') +
        '" data-action="pick" data-question="' +
        questionIndex +
        '" data-option="' +
        optionIndex +
        '">' +
        option +
        '</button>'
    })
    html += '</div></div>'
  })

  html +=
    '<div class="nav"><button class="btn ghost" data-action="back">Back</button><button class="btn" data-action="next" ' +
    (categoryAnswers.includes(null) ? 'disabled' : '') +
    '>' +
    (step === CATS.length - 1 ? 'See my score' : 'Next') +
    '</button></div>'
  app.innerHTML = html
}

function pick(questionIndex: number, optionIndex: number): void {
  const category = CATS[step]
  const categoryAnswers = answers[step]
  if (!category || !categoryAnswers || categoryAnswers[questionIndex] === undefined) return
  if (!category.q[questionIndex] || optionIndex < 0 || optionIndex > 3) return

  categoryAnswers[questionIndex] = optionIndex
  ask()
}

function categoryScore(index: number): number {
  const categoryAnswers = answers[index]
  if (!categoryAnswers) {
    throw new Error(`Social media self-audit score ${index + 1} is unavailable.`)
  }
  return categoryAnswers.reduce<number>((total, answer) => total + (answer ?? 0), 0) / 9
}

function color(score: number): string {
  return score >= 0.7 ? 'var(--ok)' : score >= 0.4 ? 'var(--warn)' : 'var(--bad)'
}

function scoreLevel(score: number): string {
  return score >= 0.7 ? 'good' : score >= 0.4 ? 'warn' : 'bad'
}

function result(): void {
  const rows: CategoryScore[] = CATS.map((category, index) => ({
    c: category,
    p: categoryScore(index),
  }))
  const score = Math.round(rows.reduce((total, row) => total + row.p * row.c.w, 0))
  const grade =
    score >= 85
      ? ['Authority', 'You’re running a strong, conversion-ready account.']
      : score >= 70
        ? ['Growth-ready', 'Solid base. A few tweaks will unlock real leads.']
        : score >= 50
          ? ['Leaking leads', 'People find you, but too many slip away.']
          : score >= 30
            ? ['Needs a reset', 'The fundamentals need rebuilding before you scale.']
            : ['Starting line', 'Great news: every fix will show quickly.']

  let html =
    '<div class="center"><span class="pill">YOUR RESULT</span><div class="ring"><svg viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="86" fill="none" stroke="var(--line)" stroke-width="16"/><circle id="arc" class="score-arc" cx="100" cy="100" r="86" fill="none" stroke="' +
    color(score / 100) +
    '" stroke-width="16" stroke-linecap="round" stroke-dasharray="0 540" transform="rotate(-90 100 100)"/></svg><b>' +
    score +
    '<small>out of 100</small></b></div><h1>' +
    grade[0] +
    '</h1><p class="mut">' +
    grade[1] +
    '</p></div>'

  html += '<div class="chart center">' + radar(rows) + '</div><h2>Score by area</h2>'
  rows.forEach((row) => {
    const percent = Math.round(row.p * 100)
    html +=
      '<div class="row"><div><span>' +
      row.c.i +
      ' ' +
      row.c.k +
      '</span><span>' +
      percent +
      '%</span></div><div class="t"><progress class="f f--' +
      scoreLevel(row.p) +
      '" max="100" value="0" data-w="' +
      percent +
      '" aria-label="' +
      row.c.k +
      ' score"></progress></div></div>'
  })

  const weakest = rows.slice().sort((a, b) => a.p * a.c.w - b.p * b.c.w).slice(0, 3)
  html += '<h2 class="fix-heading">Your top 3 fixes</h2>'
  weakest.forEach((row, index) => {
    html +=
      '<div class="fix"><b>' +
      (index + 1) +
      '. ' +
      row.c.k +
      ' (' +
      Math.round(row.p * 100) +
      '%)</b><span class="mut">' +
      row.c.tip +
      '</span></div>'
  })

  const message = encodeURIComponent(
    'Hi ' +
      BRAND +
      ', I scored ' +
      score +
      '/100 (' +
      grade[0] +
      ') on your Social Media Health Check. Weakest areas: ' +
      weakest.map((row) => row.c.k).join(', ') +
      '. Can you help?',
  )
  const action = WHATSAPP
    ? '<a class="btn" href="https://wa.me/' +
      WHATSAPP +
      '?text=' +
      message +
      '" target="_blank" rel="noopener">Get my free action plan</a>'
    : '<a class="btn" href="/daraja/contact/">Talk to Daraja</a>'
  html +=
    '<div class="center result-actions">' +
    action +
    ' <button class="btn ghost" data-action="retake">Retake</button></div>'
  app.innerHTML = html

  window.setTimeout(() => {
    const arc = document.getElementById('arc')
    if (arc) arc.setAttribute('stroke-dasharray', (score / 100 * 540) + ' 540')
    app.querySelectorAll<HTMLProgressElement>('.f').forEach((progress) => {
      progress.value = Number(progress.dataset.w)
    })
  }, 60)
}

function radar(rows: readonly CategoryScore[]): string {
  const count = rows.length
  const centerX = 150
  const centerY = 140
  const radius = 95
  const points: string[] = []
  let grid = ''
  let labels = ''

  for (let ring = 1; ring <= 4; ring++) {
    const ringPoints: string[] = []
    for (let index = 0; index < count; index++) {
      const angle = index / count * 2 * Math.PI - Math.PI / 2
      ringPoints.push(
        (centerX + radius * ring / 4 * Math.cos(angle)).toFixed(1) +
          ',' +
          (centerY + radius * ring / 4 * Math.sin(angle)).toFixed(1),
      )
    }
    grid +=
      '<polygon points="' +
      ringPoints.join(' ') +
      '" fill="none" stroke="var(--line)"/>'
  }

  rows.forEach((row, index) => {
    const angle = index / count * 2 * Math.PI - Math.PI / 2
    points.push(
      (centerX + radius * Math.max(row.p, 0.04) * Math.cos(angle)).toFixed(1) +
        ',' +
        (centerY + radius * Math.max(row.p, 0.04) * Math.sin(angle)).toFixed(1),
    )
    labels +=
      '<text x="' +
      (centerX + (radius + 24) * Math.cos(angle)).toFixed(1) +
      '" y="' +
      (centerY + (radius + 20) * Math.sin(angle) + 4).toFixed(1) +
      '" text-anchor="middle" font-size="11" fill="var(--mut)">' +
      row.c.i +
      ' ' +
      row.c.k.split(' ')[0] +
      '</text>'
  })

  return (
    '<svg class="chart-svg" viewBox="0 0 300 290" width="100%">' +
    grid +
    '<polygon points="' +
    points.join(' ') +
    '" fill="rgba(255,90,54,.25)" stroke="var(--acc)" stroke-width="2"/>' +
    labels +
    '</svg>'
  )
}

function again(): void {
  answers.forEach((categoryAnswers) => categoryAnswers.fill(null))
  go(-1)
}

app.addEventListener('click', (event: MouseEvent) => {
  if (!(event.target instanceof Element)) return
  const button = event.target.closest<HTMLButtonElement>('button[data-action]')
  if (!button || button.disabled) return

  const action = button.dataset.action
  switch (action) {
    case 'start':
      go(0)
      break
    case 'pick':
      pick(Number(button.dataset.question), Number(button.dataset.option))
      break
    case 'back':
      go(step > 0 ? step - 1 : -1)
      break
    case 'next':
      go(step + 1)
      break
    case 'retake':
      again()
      break
  }
})

intro()

export {}
