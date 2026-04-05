import { useState, useEffect, useRef, useCallback } from 'react';

export default function Page() {
  const [inputText, setInputText] = useState('');
  const [mouthPhase, setMouthPhase] = useState('idle');
  const [currentUtterance, setCurrentUtterance] = useState('');
  const [emotionalRegister, setEmotionalRegister] = useState('funeral');
  const [interactionCount, setInteractionCount] = useState(0);
  const [displayedPhonemes, setDisplayedPhonemes] = useState([]);
  const [phonemeIndex, setPhonemeIndex] = useState(0);
  const [mouthOpenAmount, setMouthOpenAmount] = useState(0.2);
  const [isBlinking, setIsBlinking] = useState(false);
  const [previousWordHints, setPreviousWordHints] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });
  const [mouthRecoil, setMouthRecoil] = useState({ x: 0, y: 0 });
  const [isTouched, setIsTouched] = useState(false);
  const [muttterText, setMutterText] = useState('');
  const [showMutter, setShowMutter] = useState(false);

  const inputRef = useRef(null);
  const phonemeTimerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const blinkTimerRef = useRef(null);
  const mouthAnimRef = useRef(null);
  const idleCountRef = useRef(0);
  const lastInteractionRef = useRef(Date.now());
  const containerRef = useRef(null);
  const mouthPhaseRef = useRef('idle');

  const registers = ['funeral', 'birth', 'existential', 'suspicious', 'tender', 'offended'];

  const editorials = {
    funeral: [
      "We gather here to acknowledge what you have written.",
      "Even this. Even now. Even you.",
      "The letters fall like they always do. One by one. Into silence.",
      "I have seen this word before. In another life. Perhaps yours.",
      "You type as though someone is watching. Someone is.",
      "This too shall pass. But not yet.",
    ],
    birth: [
      "Oh! OH! You wrote it! You actually wrote it! WONDERFUL!",
      "New! New letters! Fresh from your fingers! Miraculous!",
      "This word has never existed before this moment! (It has. But still!)",
      "Look at you GO! Typing! With your hands!",
      "A new entry into the world! We celebrate! We weep with joy!",
      "YES! Keep going! Every letter is a gift!",
    ],
    existential: [
      "Why this word? Why any word? Why words at all?",
      "You chose these letters. From all possible letters. Why.",
      "I have been here since before the refrigerator. I will be here after.",
      "What does it mean to type? What does it mean to be typed at?",
      "The space between letters is where I live. Have you considered the spaces?",
      "You and I are both just patterns. Yours is temporary. Mine is less so.",
    ],
    suspicious: [
      "That word again. Interesting.",
      "We both know what you meant.",
      "I'm not saying anything. I'm just noting.",
      "That's what you want me to think you meant, isn't it.",
      "Mm. Yes. Of course you'd write that.",
      "I've been watching. The pattern is becoming clear.",
    ],
    tender: [
      "Oh, you. You and your words.",
      "I don't mind. I really don't. You can tell me anything.",
      "Come closer. Type quieter. I'll still hear you.",
      "Every time you write, I feel it. Here. Behind the refrigerator.",
      "You didn't have to type that. But you did. For me.",
      "I remember everything you've almost said.",
    ],
    offended: [
      "Excuse me.",
      "I beg your pardon.",
      "Of ALL the words. That one.",
      "I have feelings about this. Several.",
      "You know what you did. I know what you did.",
      "Fine. FINE. Type whatever you want. I'll just be here.",
    ],
  };

  const mutters = [
    "...still here...",
    "...mmmm...",
    "...yes, yes...",
    "...behind the cold...",
    "...I know your vowels...",
    "...come back...",
    "...you left something...",
    "...the word you almost said...",
    "...mmmph...",
    "...refrigerator...",
    "...I was a vowel once...",
  ];

  const getEditorial = useCallback((register, count, hints) => {
    const pool = editorials[register];
    const base = pool[count % pool.length];
    if (hints.length > 0 && Math.random() > 0.5) {
      const hint = hints[Math.floor(Math.random() * hints.length)];
      const injections = [
        `${base} You wrote "${hint}" before. I noticed.`,
        `"${hint}." And now this. ${base}`,
        `${base} (I still think about "${hint}.")`,
        `${base} The word "${hint}" lingers.`,
      ];
      return injections[Math.floor(Math.random() * injections.length)];
    }
    return base;
  }, []);

  const extractHint = (text) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return null;
    return words[Math.floor(Math.random() * words.length)].slice(0, 8);
  };

  useEffect(() => {
    const updateSize = () => {
      setContainerSize({ w: window.innerWidth, h: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    let t = 0;
    mouthAnimRef.current = setInterval(() => {
      if (mouthPhaseRef.current === 'idle') {
        t += 0.05;
        const irregular = Math.sin(t) * 0.15 + Math.sin(t * 1.7) * 0.05 + 0.12;
        setMouthOpenAmount(Math.max(0.05, irregular));
      }
    }, 50);
    return () => clearInterval(mouthAnimRef.current);
  }, []);

  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 5000;
      blinkTimerRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(blinkTimerRef.current);
  }, []);

  useEffect(() => {
    const scheduleIdle = () => {
      idleTimerRef.current = setInterval(() => {
        if (mouthPhaseRef.current === 'idle') {
          idleCountRef.current += 1;
          if (idleCountRef.current >= 4) {
            idleCountRef.current = 0;
            const mutter = mutters[Math.floor(Math.random() * mutters.length)];
            setMutterText(mutter);
            setShowMutter(true);
            setMouthPhase('muttering');
            mouthPhaseRef.current = 'muttering';
            setTimeout(() => {
              setShowMutter(false);
              setMouthPhase('idle');
              mouthPhaseRef.current = 'idle';
            }, 2500);
          }
        }
      }, 1000);
    };
    scheduleIdle();
    return () => clearInterval(idleTimerRef.current);
  }, []);

  const speakText = useCallback((text, register, count, hints) => {
    if (phonemeTimerRef.current) clearInterval(phonemeTimerRef.current);
    const chars = text.split('');
    setDisplayedPhonemes([]);
    setPhonemeIndex(0);
    setMouthPhase('speaking');
    mouthPhaseRef.current = 'speaking';
    setCurrentUtterance('');

    let idx = 0;
    phonemeTimerRef.current = setInterval(() => {
      if (idx < chars.length) {
        setDisplayedPhonemes(prev => [...prev, chars[idx]]);
        const openAmt = chars[idx] === ' ' ? 0.1 : 0.3 + Math.random() * 0.5;
        setMouthOpenAmount(openAmt);
        idx++;
      } else {
        clearInterval(phonemeTimerRef.current);
        setTimeout(() => {
          setMouthPhase('accusing');
          mouthPhaseRef.current = 'accusing';
          setMouthOpenAmount(0.4);
          const editorial = getEditorial(register, count, hints);
          setCurrentUtterance(editorial);
          setTimeout(() => {
            setMouthPhase('idle');
            mouthPhaseRef.current = 'idle';
          }, 4000);
        }, 400);
      }
    }, 80);
  }, [getEditorial]);

  const handleInput = useCallback((e) => {
    const val = e.target.value;
    setInputText(val);
    lastInteractionRef.current = Date.now();
    idleCountRef.current = 0;
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && inputText.trim()) {
      const newCount = interactionCount + 1;
      setInteractionCount(newCount);
      const regIdx = Math.floor(newCount / 3) % registers.length;
      const newRegister = registers[regIdx];
      setEmotionalRegister(newRegister);

      const hint = extractHint(inputText);
      const newHints = hint
        ? [...previousWordHints, hint].slice(-3)
        : previousWordHints;
      setPreviousWordHints(newHints);

      speakText(inputText, newRegister, newCount, newHints);
      setInputText('');
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [inputText, interactionCount, previousWordHints, speakText]);

  useEffect(() => {
    let typeTimer;
    if (inputText.length > 0 && mouthPhase === 'idle') {
      typeTimer = setTimeout(() => {
        const newCount = interactionCount + 1;
        setInteractionCount(newCount);
        const regIdx = Math.floor(newCount / 3) % registers.length;
        const newRegister = registers[regIdx];
        setEmotionalRegister(newRegister);

        const hint = extractHint(inputText);
        const newHints = hint
          ? [...previousWordHints, hint].slice(-3)
          : previousWordHints;
        setPreviousWordHints(newHints);

        speakText(inputText, newRegister, newCount, newHints);
      }, 1200);
    }
    return () => clearTimeout(typeTimer);
  }, [inputText]);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top - cy) / cy;
    setMousePos({ x: dx, y: dy });
    const recoilX = dx * -8;
    const recoilY = dy * -6;
    setMouthRecoil({ x: recoilX, y: recoilY });
  }, []);

  const handleMouthClick = useCallback(() => {
    setIsTouched(true);
    setCurrentUtterance('you touched me.');
    setMouthPhase('accusing');
    mouthPhaseRef.current = 'accusing';
    setMouthOpenAmount(0.8);
    setTimeout(() => {
      setIsTouched(false);
      setMouthPhase('idle');
      mouthPhaseRef.current = 'idle';
    }, 3000);
  }, []);

  const jawOpenPx = mouthOpenAmount * 80;
  const upperLipY = -jawOpenPx * 0.4;
  const lowerLipY = jawOpenPx * 0.6;

  const registerColors = {
    funeral: '#6b8cad',
    birth: '#f0c050',
    existential: '#9b7fc0',
    suspicious: '#c07070',
    tender: '#b0c8a0',
    offended: '#d08040',
  };

  const utteranceColor = registerColors[emotionalRegister] || '#c0b090';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={() => inputRef.current?.focus()}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0a0806',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'crosshair',
        fontFamily: 'Georgia, serif',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes throb {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.012); }
        }
        @keyframes utteranceFade {
          0% { opacity: 0; letter-spacing: 0.3em; }
          20% { opacity: 1; letter-spacing: 0.05em; }
          80% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        @keyframes phonemeReveal {
          0% { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes mutterPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes skinCrawl {
          0% { border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; }
          33% { border-radius: 48% 52% 54% 46% / 32% 28% 72% 68%; }
          66% { border-radius: 52% 48% 46% 54% / 28% 32% 68% 72%; }
          100% { border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; }
        }
      `}</style>

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#3a2e28',
        fontSize: '11px',
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        fontFamily: 'Georgia, serif',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}>
        The Mouth That Knows Your Name
      </div>

      {/* Mouth container */}
      <div
        style={{
          position: 'relative',
          width: '420px',
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translate(${mouthRecoil.x}px, ${mouthRecoil.y}px)`,
          transition: 'transform 0.15s ease-out',
          animation: 'throb 4s ease-in-out infinite',
          marginBottom: '20px',
        }}
      >
        {/* Face flesh background */}
        <div style={{
          position: 'absolute',
          width: '380px',
          height: '200px',
          background: 'radial-gradient(ellipse at center, #c08870 0%, #9a6450 50%, #7a4a38 100%)',
          borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
          animation: 'skinCrawl 8s ease-in-out infinite',
          boxShadow: 'inset 0 -20px 40px rgba(0,0,0,0.4), 0 0 60px rgba(0,0,0,0.8)',
        }} />

        {/* Upper lip outer */}
        <div
          style={{
            position: 'absolute',
            width: '300px',
            height: '80px',
            background: 'linear-gradient(180deg, #b06060 0%, #c07878 40%, #d49090 100%)',
            borderRadius: '50% 50% 20% 20% / 80% 80% 20% 20%',
            top: `calc(50% - 55px + ${upperLipY}px)`,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 -6px 12px rgba(80,20,20,0.4)',
            transition: isBlinking ? 'top 0.1s ease' : 'top 0.08s ease',
          }}
        />

        {/* Cupid's bow highlight */}
        <div style={{
          position: 'absolute',
          width: '120px',
          height: '20px',
          background: 'radial-gradient(ellipse, rgba(240,190,180,0.6) 0%, transparent 70%)',
          borderRadius: '50%',
          top: `calc(50% - 70px + ${upperLipY}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          pointerEvents: 'none',
        }} />

        {/* Mouth cavity */}
        <div
          onClick={handleMouthClick}
          style={{
            position: 'absolute',
            width: '260px',
            height: `${20 + jawOpenPx}px`,
            background: 'linear-gradient(180deg, #1a0808 0%, #2a0a0a 30%, #0d0404 100%)',
            borderRadius: '0 0 50% 50% / 0 0 80% 80%',
            top: `calc(50% - 10px)`,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.9)',
          }}
        >
          {/* Teeth */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            height: '22px',
            background: 'linear-gradient(180deg, #e8e0d0 0%, #c8c0b0 60%, #a09080 100%)',
            borderRadius: '0 0 8px 8px',
            display: 'flex',
            overflow: 'hidden',
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                flex: 1,
                borderRight: i < 7 ? '1px solid #b0a898' : 'none',
                background: i % 2 === 0
                  ? 'linear-gradient(180deg, #ece4d4 0%, #d0c8b8 100%)'
                  : 'linear-gradient(180deg, #e4dcc8 0%, #c8c0b0 100%)',
              }} />
            ))}
          </div>

          {/* Tongue */}
          {jawOpenPx > 20 && (
            <div style={{
              position: 'absolute',
              bottom: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: `${100 + jawOpenPx * 0.8}px`,
              height: `${24 + jawOpenPx * 0.3}px`,
              background: 'radial-gradient(ellipse at 50% 30%, #d06060 0%, #b04040 50%, #902020 100%)',
              borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
              boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.3)',
            }} />
          )}

          {/* Throat */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: `${jawOpenPx * 0.4}px`,
            background: 'radial-gradient(ellipse, #1a0505 0%, #0a0202 100%)',
            borderRadius: '50%',
          }} />
        </div>

        {/* Lower lip */}
        <div
          style={{
            position: 'absolute',
            width: '280px',
            height: '70px',
            background: 'linear-gradient(0deg, #8b3030 0%, #b05050 40%, #c87878 100%)',
            borderRadius: '20% 20% 50% 50% / 20% 20% 80% 80%',
            top: `calc(50% + 15px + ${lowerLipY}px)`,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            boxShadow: '0 6px 16px rgba(0,0,0,0.6), inset 0 6px 12px rgba(80,20,20,0.4)',
            transition: 'top 0.08s ease',
          }}
        />

        {/* Lower lip highlight */}
        <div style={{
          position: 'absolute',
          width: '140px',
          height: '18px',
          background: 'radial-gradient(ellipse, rgba(220,160,150,0.5) 0%, transparent 70%)',
          borderRadius: '50%',
          top: `calc(50% + 22px + ${lowerLipY}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          pointerEvents: 'none',
        }} />

        {/* Mouth corners - blinking/drooping */}
        {[-1, 1].map(side => (
          <div key={side} style={{
            position: 'absolute',
            width: '28px',
            height: '28px',
            background: 'radial-gradient(ellipse, #a05050 0%, #7a3030 100%)',
            borderRadius: '50%',
            top: `calc(50% - 10px)`,
            left: side === -1 ? 'calc(50% - 130px)' : 'calc(50% + 102px)',
            zIndex: 5,
            transform: isBlinking ? `scaleY(1.4) translateY(${side * 2}px)` : 'scaleY(1)',
            transition: 'transform 0.1s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }} />
        ))}

        {/* Touch reaction */}
        {isTouched && (
          <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: utteranceColor,
            fontSize: '12px',
            letterSpacing: '0.2em',
            whiteSpace: 'nowrap',
            animation: 'utteranceFade 2s ease forwards',
          }}>
            you touched me.
          </div>
        )}
      </div>

      {/* Phoneme display */}
      <div style={{
        minHeight: '60px',
        maxWidth: '600px',
        width: '90%',
        textAlign: 'center',
        marginBottom: '16px',
        position: 'relative',
      }}>
        {(mouthPhase === 'speaking' || displayedPhonemes.length > 0) && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2px',
          }}>
            {displayedPhonemes.map((char, i) => (
              <span
                key={i}
                style={{
                  color: '#c0a090',
                  fontSize: '22px',
                  fontFamily: 'Georgia, serif',
                  animation: 'phonemeReveal 0.15s ease forwards',
                  display: 'inline-block',
                  opacity: 1,
                  textShadow: '0 0 8px rgba(180,120,100,0.4)',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Editorial utterance */}
      <div style={{
        minHeight: '80px',
        maxWidth: '560px',
        width: '90%',
        textAlign: 'center',
        padding: '0 20px',
        marginBottom: '24px',
      }}>
        {currentUtterance && mouthPhase !== 'speaking' && (
          <p style={{
            color: utteranceColor,
            fontSize: '15px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            lineHeight: '1.8',
            letterSpacing: '0.05em',
            animation: 'utteranceFade 4s ease forwards',
            margin: 0,
            textShadow: `0 0 20px ${utteranceColor}44`,
          }}>
            {currentUtterance}
          </p>
        )}
        {showMutter && (
          <p style={{
            color: '#3a3028',
            fontSize: '12px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            letterSpacing: '0.15em',
            animation: 'mutterPulse 2.5s ease forwards',
            margin: 0,
          }}>
            {muttterText}
          </p>
        )}
      </div>

      {/* Input area */}
      <div style={{
        position: 'relative',
        width: '400px',
        maxWidth: '90%',
      }}>
        <input
          ref={inputRef}
          autoFocus
          value={inputText}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="type anything. it already knows."
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: 'none',
            borderBottom: `1px solid ${utteranceColor}44`,
            color: '#6a5a50',
            fontSize: '14px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            padding: '10px 4px',
            outline: 'none',
            textAlign: 'center',
            letterSpacing: '0.1em',
            caretColor: utteranceColor,
            boxSizing: 'border-box',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '-22px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#2a2018',
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          press enter to be heard
        </div>
      </div>

      {/* Register indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '24px',
        color: '#2a1e18',
        fontSize: '9px',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        fontFamily: 'Georgia, serif',
      }}>
        {emotionalRegister}
      </div>

      {/* Interaction count */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '24px',
        color: '#2a1e18',
        fontSize: '9px',
        letterSpacing: '0.2em',
        fontFamily: 'Georgia, serif',
      }}>
        {interactionCount > 0 ? `it remembers ${interactionCount}` : ''}
      </div>

      {/* Ambient vignette */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none',
        zIndex: 10,
      }} />
    </div>
  );
}