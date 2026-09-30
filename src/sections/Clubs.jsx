import { motion } from 'motion/react'
import { CLUB_CHAT } from '../data.js'
import { Eyebrow, Reveal } from '../ui.jsx'

export default function Clubs() {
  return (
    <section id="clubs" className="section clubs">
      <div className="container">
        <div className="clubs-card">
          <div className="clubs-copy">
            <Reveal><Eyebrow>Book clubs · new</Eyebrow></Reveal>
            <Reveal delay={0.05}><h2 className="h2">Start a plan with friends. <span className="accent-text">Finish it together.</span></h2></Reveal>
            <Reveal delay={0.1}><p className="lede">Invite your book club, your partner or your team. Everyone reads the same page each day and shares what they tried.</p></Reveal>
            <Reveal delay={0.15}><a href="#start" className="btn btn-ghost">Create a group plan</a></Reveal>
          </div>
          <motion.div
            className="chat"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.5 }}
            aria-label="Example group chat for the Sunday Book Club"
          >
            <motion.div className="chat-head" variants={{ hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0 } }}>
              <div className="avatars">
                {CLUB_CHAT.map((c) => <span key={c.initials} style={{ background: c.color }}>{c.initials}</span>)}
              </div>
              <span><strong>Sunday Book Club</strong> · Day 9 of 21</span>
            </motion.div>
            {CLUB_CHAT.map((c, i) => (
              <motion.div
                key={c.initials}
                className={`bubble ${c.me ? 'me' : ''}`}
                variants={{
                  hidden: { opacity: 0, y: 16, scale: 0.94 },
                  shown: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.3 + i * 0.7, type: 'spring', stiffness: 260, damping: 22 } },
                }}
              >
                <span className="bubble-who">{c.who} · Day 9</span>
                <span>{c.text}</span>
              </motion.div>
            ))}
            <motion.div className="typing" variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 2.6 } } }} aria-hidden="true">
              <span /><span /><span />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
