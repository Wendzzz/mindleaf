import { motion } from 'motion/react'
import { PILE } from '../data.js'
import { Eyebrow, Reveal } from '../ui.jsx'

// The half-read pile: spines drop onto the stack one by one, bookmarks stuck early.
export default function Pile() {
  return (
    <section className="pile section">
      <div className="container pile-grid">
        <motion.div
          className="pile-stack"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.4 }}
          aria-label="A stack of half-read books with bookmarks near the start"
        >
          {PILE.map((b, i) => (
            <motion.div
              key={b.title}
              className="spine"
              style={{ '--sp-bg': b.bg, '--sp-ink': b.ink, '--sp-band': b.band, width: `${b.width}%` }}
              variants={{
                hidden: { y: -160, opacity: 0, rotate: b.tilt * 6 },
                shown: { y: 0, opacity: 1, rotate: b.tilt, transition: { delay: i * 0.12, type: 'spring', stiffness: 170, damping: 15 } },
              }}
            >
              <span className="spine-band" />
              <span className="spine-title">{b.title}</span>
              <span className="spine-mark">
                <span className="spine-note">{b.note}</span>
              </span>
            </motion.div>
          ))}
        </motion.div>
        <div className="pile-copy">
          <Reveal><Eyebrow>Be honest</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="h2">Every shelf has <span className="accent-text">one.</span></h2></Reveal>
          <Reveal delay={0.1}>
            <p className="lede">You bought it with good intentions. You read a chapter or two, life got busy, and the bookmark hasn’t moved since.</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="lede">That isn’t a willpower problem. A 300-page book just doesn’t fit into a normal Tuesday. <strong>So Mindleaf breaks it into days that do.</strong></p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
