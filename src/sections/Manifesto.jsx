import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { PHOTOS } from '../data.js'

const TEXT = 'Big books are easy to start and hard to finish. So we made them smaller, one morning at a time.'

function Word({ word, i, total, progress }) {
  const start = i / total
  const opacity = useTransform(progress, [start, Math.min(1, start + 1.5 / total)], [0.22, 1])
  const isKey = word.startsWith('smaller')
  return (
    <motion.span style={{ opacity }} className={isKey ? 'key' : ''}>
      {word}{' '}
    </motion.span>
  )
}

// The words light up as you read down the page, over a photo with a green wash.
export default function Manifesto() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] })
  const { scrollYProgress: photoP } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(photoP, [0, 1], ['-8%', '8%'])
  const words = TEXT.split(' ')
  return (
    <section className="manifesto" ref={ref}>
      <motion.img src={PHOTOS.band} alt="" className="manifesto-photo" style={{ y: photoY }} />
      <div className="manifesto-wash" />
      <div className="container manifesto-inner">
        <span className="manifesto-tag">Why Mindleaf</span>
        <p className="manifesto-text" aria-label={TEXT}>
          <span aria-hidden="true">
            {words.map((w, i) => <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />)}
          </span>
        </p>
      </div>
    </section>
  )
}
