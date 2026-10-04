import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { BOOKS, TOPICS } from '../data.js'
import { Eyebrow, Icon, Reveal, Tilt } from '../ui.jsx'

const chipList = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}
const chipItem = {
  hidden: { opacity: 0, y: 14, scale: 0.85 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 18 } },
}

export default function Library() {
  const [topic, setTopic] = useState('All')
  const shown = topic === 'All' ? BOOKS : BOOKS.filter((b) => b.topic === topic)
  return (
    <section id="library" className="section library">
      <div className="container">
        <div className="lib-head">
          <div>
            <Reveal><Eyebrow>The library</Eyebrow></Reveal>
            <Reveal delay={0.05}><h2 className="h2">Pick a book.<br />We’ll plan <span className="accent-text">the days.</span></h2></Reveal>
          </div>
          <motion.div
            className="chips"
            variants={chipList}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.6 }}
          >
            <div role="group" aria-label="Filter plans by topic" className="chips-row">
              {TOPICS.map((t) => (
                <motion.button key={t} variants={chipItem} type="button" className={`chip-btn ${t === topic ? 'is-on' : ''}`} aria-pressed={t === topic} onClick={() => setTopic(t)}>
                  {t === topic && <motion.span layoutId="chip-pill" className="chip-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span>{t}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="shelf-scroll">
          <motion.ul className="shelf" layout>
            <AnimatePresence mode="popLayout">
              {shown.map((b, i) => (
                <motion.li
                  key={b.id}
                  layout
                  className="book"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26, delay: i * 0.04 }}
                >
                  <a href="./app/#/library" className="book-link" aria-label={`${b.title} by ${b.author}, ${b.days} days, ${b.mins} minutes a day`}>
                    <Tilt className="book-cover-wrap" max={8}>
                      <img src={b.cover} alt="" className="book-cover" loading="lazy" />
                      <span className="book-tag"><Icon.clock /> {b.days} days · {b.mins} min</span>
                    </Tilt>
                    <span className="book-title">{b.title}</span>
                    <span className="book-author">{b.author}</span>
                  </a>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>

      </div>
    </section>
  )
}
