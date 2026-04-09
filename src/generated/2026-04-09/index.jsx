import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const initialSounds = [
    "the sound a thought makes when you almost have it",
    "ice deciding to melt",
    "a very confident wrong answer",
    "the specific frequency of being watched by a painting",
    "the hum of a word you've forgotten how to spell",
    "the noise a shadow makes when no one is casting it",
    "the vibration of a door that was never opened",
    "the acoustic signature of mild regret at 3:47pm",
    "the sound of someone else's memory playing in your ear",
    "the frequency at which dust becomes intentional",
    "a ceiling fan's opinion about the weather",
    "the resonance of a decision you haven't made yet",
    "the creak of time pretending to be a floorboard",
    "the sound a color makes when it's embarrassed",
    "the pitch of almost-recognition",
    "the low drone of something that used to be certain",
  ];

  const [phase, setPhase] = useState('bracket'); // 'bracket' | 'certificate'
  const [round, setRound] = useState(0);
  const [matchupIndex, setMatchupIndex] = useState(0);
  const [roundSounds, setRoundSounds] = useState(initialSounds);
  const [winners, setWinners] = useState([]);
  const [champion, setChampion] = useState('');
  const [resultFlash, setResultFlash] = useState(null);
  const [sealDrip, setSealDrip] = useState(0);
  const [hoveredSide, setHoveredSide] = useState(null);
  const [pastRounds, setPastRounds] = useState([]);
  const [lastWinner, setLastWinner] = useState(null);
  const sealInterval = useRef(null);

  const roundNames = ['ROUND OF 16', 'QUARTERFINALS', 'SEMIFINALS', 'THE FINAL'];
  const totalRounds = 4;

  const currentMatchupSounds = [
    roundSounds[matchupIndex * 2],
    roundSounds[matchupIndex * 2 + 1],
  ];

  const matchupsInRound = roundSounds.length / 2;

  useEffect(() => {
    if (phase === 'certificate') {
      let drip = 0;
      sealInterval.current = setInterval(() => {
        drip += 2;
        setSealDrip(drip);
        if (drip >= 100) clearInterval(sealInterval.current);
      }, 80);
      return () => clearInterval(sealInterval.current);
    }
  }, [phase]);

  useEffect(() => {
    if (resultFlash) {
      const t = setTimeout(() => setResultFlash(null), 700);
      return () => clearTimeout(t);
    }
  }, [resultFlash]);

  const mutate = (winner, loser) => {
    const loserSnippet = loser.split(' ').slice(0, 5).join(' ');
    return `${winner} (now carrying traces of: ${loserSnippet})`;
  };

  const handleChoice = (side) => {
    const winner = currentMatchupSounds[side];
    const loser = currentMatchupSounds[side === 0 ? 1 : 0];
    const mutated = mutate(winner, loser);

    setResultFlash(side === 0 ? 'left' : 'right');
    setLastWinner(mutated);

    const newWinners = [...winners, mutated];

    if (newWinners.length === matchupsInRound) {
      // Round complete
      if (newWinners.length === 1) {
        setChampion(newWinners[0]);
        setPhase('certificate');
      } else {
        setPastRounds(pr => [...pr, { round, sounds: roundSounds }]);
        setRound(r => r + 1);
        setRoundSounds(newWinners);
        setMatchupIndex(0);
        setWinners([]);
      }
    } else {
      setWinners(newWinners);
      setMatchupIndex(i => i + 1);
    }
  };

  const fontSize = (text) => {
    if (text.length < 60) return '1.4rem';
    if (text.length < 120) return '1.1rem';
    if (text.length < 200) return '0.85rem';
    return '0.65rem';
  };

  const sealY = sealDrip * 1.5;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#ffffff',
      fontFamily: "'Arial Black', 'Arial Bold', Gadget, sans-serif",
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes pulse-glow-blue {
          0%, 100% { box-shadow: 0 0 10px #0057FF, 0 0 20px #0057FF44; }
          50% { box-shadow: 0 0 25px #0057FF, 0 0 50px #0057FF88; }
        }
        @keyframes pulse-glow-red {
          0%, 100% { box-shadow: 0 0 10px #CC0000, 0 0 20px #CC000044; }
          50% { box-shadow: 0 0 25px #CC0000, 0 0 50px #CC000088; }
        }
        @keyframes flash-win {
          0% { opacity: 1; transform: scale(1.03); }
          50% { opacity: 0.7; transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes drip-fall {
          0% { transform: translateY(0); }
          100% { transform: translateY(200px); }
        }
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes scanline {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes champion-pulse {
          0%, 100% { text-shadow: 0 0 10px #FFD700, 0 0 30px #FFD70066; }
          50% { text-shadow: 0 0 25px #FFD700, 0 0 60px #FFD700aa; }
        }
        @keyframes seal-wobble {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bracket-line-draw {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1a3a 50%, #0a0a0f 100%)',
        borderBottom: '4px solid #FFD700',
        padding: '0',
      }}>
        <div style={{
          background: '#CC0000',
          padding: '4px 20px',
          fontSize: '0.7rem',
          letterSpacing: '4px',
          textAlign: 'center',
          fontWeight: 900,
        }}>
          ◆ WORLD COMPETITIVE LISTENING ASSOCIATION ◆ OFFICIAL BROADCAST ◆
        </div>
        <div style={{ padding: '20px 30px 10px', textAlign: 'center' }}>
          <div style={{
            fontSize: '0.75rem',
            letterSpacing: '8px',
            color: '#FFD700',
            marginBottom: '4px',
          }}>THE</div>
          <div style={{
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: 900,
            letterSpacing: '2px',
            lineHeight: 1,
            textTransform: 'uppercase',
            color: '#ffffff',
            textShadow: '3px 3px 0 #CC0000, 6px 6px 0 #00003320',
          }}>
            WORLD COMPETITIVE LISTENING
          </div>
          <div style={{
            fontSize: 'clamp(1rem, 3vw, 2rem)',
            fontWeight: 900,
            color: '#FFD700',
            letterSpacing: '6px',
            textShadow: '0 0 20px #FFD70066',
          }}>
            CHAMPIONSHIP
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#aaaacc',
            letterSpacing: '4px',
            marginTop: '6px',
          }}>
            {phase === 'bracket' ? roundNames[round] : 'CHAMPION CROWNED'}
          </div>
        </div>

        {/* Score ticker */}
        <div style={{
          background: '#0057FF',
          padding: '6px 0',
          overflow: 'hidden',
          position: 'relative',
          height: '28px',
        }}>
          <div style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            animation: 'ticker 20s linear infinite',
            fontSize: '0.75rem',
            fontWeight: 900,
            letterSpacing: '2px',
            color: '#ffffff',
          }}>
            &nbsp;&nbsp;&nbsp;
            ROUND {round + 1} OF {totalRounds} &nbsp;•&nbsp;
            MATCHUP {matchupIndex + 1} OF {matchupsInRound} &nbsp;•&nbsp;
            {winners.length} SOUNDS ELIMINATED &nbsp;•&nbsp;
            CERTIFIED JUDGES REQUIRED &nbsp;•&nbsp;
            NO REFUNDS FOR UNHEARABLE SOUNDS &nbsp;•&nbsp;
            LISTENING IS A COMPETITIVE SPORT &nbsp;•&nbsp;
            YOU ARE BEING JUDGED ON YOUR JUDGMENT &nbsp;•&nbsp;
          </div>
        </div>
      </div>

      {phase === 'bracket' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '30px 20px',
          animation: 'fade-in 0.5s ease',
        }}>
          {/* Round indicator */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '30px',
          }}>
            {roundNames.map((name, i) => (
              <div key={i} style={{
                padding: '6px 14px',
                background: i === round ? '#FFD700' : i < round ? '#0057FF' : '#1a1a2e',
                color: i === round ? '#000000' : '#ffffff',
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '2px',
                border: '2px solid',
                borderColor: i === round ? '#FFD700' : i < round ? '#0057FF' : '#333355',
                transition: 'all 0.3s',
                opacity: i > round ? 0.4 : 1,
              }}>
                {name}
              </div>
            ))}
          </div>

          {/* Matchup card */}
          <div style={{
            fontSize: '0.7rem',
            letterSpacing: '4px',
            color: '#888899',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            MATCHUP {matchupIndex + 1} / {matchupsInRound} — SELECT THE SUPERIOR SOUND
          </div>

          <div style={{
            display: 'flex',
            gap: '0',
            alignItems: 'stretch',
            maxWidth: '900px',
            width: '100%',
            position: 'relative',
          }}>
            {/* VS divider */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              background: '#0a0a0f',
              border: '3px solid #FFD700',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 900,
              color: '#FFD700',
              textShadow: '0 0 10px #FFD700',
              boxShadow: '0 0 20px #FFD70044',
            }}>
              VS
            </div>

            {/* Left sound (Blue team) */}
            <div
              onClick={() => !resultFlash && handleChoice(0)}
              onMouseEnter={() => setHoveredSide(0)}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                flex: 1,
                background: resultFlash === 'left'
                  ? 'linear-gradient(135deg, #0057FF, #003db3)'
                  : hoveredSide === 0
                    ? 'linear-gradient(135deg, #0a1a3a, #0d2255)'
                    : 'linear-gradient(135deg, #0a0f1a, #0d1535)',
                border: '3px solid',
                borderColor: resultFlash === 'left' ? '#FFD700' : '#0057FF',
                borderRight: 'none',
                padding: '40px 50px 40px 30px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                animation: resultFlash === 'left' ? 'flash-win 0.7s ease' : hoveredSide === 0 ? 'pulse-glow-blue 1.5s ease infinite' : 'none',
                position: 'relative',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{
                fontSize: '0.6rem',
                letterSpacing: '4px',
                color: '#0057FF',
                marginBottom: '12px',
                fontWeight: 900,
              }}>
                ◀ SEED #1 — CLICK TO ADVANCE
              </div>
              <div style={{
                background: '#0057FF',
                color: '#ffffff',
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '3px',
                padding: '3px 8px',
                display: 'inline-block',
                marginBottom: '12px',
                width: 'fit-content',
              }}>
                CONTENDER A
              </div>
              <div style={{
                fontSize: fontSize(currentMatchupSounds[0] || ''),
                fontWeight: 900,
                lineHeight: 1.3,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {currentMatchupSounds[0]}
              </div>
              {hoveredSide === 0 && (
                <div style={{
                  marginTop: '16px',
                  fontSize: '0.65rem',
                  color: '#0057FFAA',
                  letterSpacing: '2px',
                  fontStyle: 'italic',
                }}>
                  ♦ performing now ♦
                </div>
              )}
            </div>

            {/* Right sound (Red team) */}
            <div
              onClick={() => !resultFlash && handleChoice(1)}
              onMouseEnter={() => setHoveredSide(1)}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                flex: 1,
                background: resultFlash === 'right'
                  ? 'linear-gradient(225deg, #CC0000, #8b0000)'
                  : hoveredSide === 1
                    ? 'linear-gradient(225deg, #2a0a0a, #3a0d0d)'
                    : 'linear-gradient(225deg, #1a0a0a, #200d0d)',
                border: '3px solid',
                borderColor: resultFlash === 'right' ? '#FFD700' : '#CC0000',
                borderLeft: 'none',
                padding: '40px 30px 40px 50px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                animation: resultFlash === 'right' ? 'flash-win 0.7s ease' : hoveredSide === 1 ? 'pulse-glow-red 1.5s ease infinite' : 'none',
                position: 'relative',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end',
                textAlign: 'right',
              }}
            >
              <div style={{
                fontSize: '0.6rem',
                letterSpacing: '4px',
                color: '#CC0000',
                marginBottom: '12px',
                fontWeight: 900,
              }}>
                SEED #2 — CLICK TO ADVANCE ▶
              </div>
              <div style={{
                background: '#CC0000',
                color: '#ffffff',
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '3px',
                padding: '3px 8px',
                display: 'inline-block',
                marginBottom: '12px',
              }}>
                CONTENDER B
              </div>
              <div style={{
                fontSize: fontSize(currentMatchupSounds[1] || ''),
                fontWeight: 900,
                lineHeight: 1.3,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {currentMatchupSounds[1]}
              </div>
              {hoveredSide === 1 && (
                <div style={{
                  marginTop: '16px',
                  fontSize: '0.65rem',
                  color: '#CC0000AA',
                  letterSpacing: '2px',
                  fontStyle: 'italic',
                }}>
                  ♦ performing now ♦
                </div>
              )}
            </div>
          </div>

          {/* Winner flash message */}
          {resultFlash && (
            <div style={{
              marginTop: '20px',
              padding: '10px 30px',
              background: '#FFD700',
              color: '#000000',
              fontSize: '1rem',
              fontWeight: 900,
              letterSpacing: '4px',
              animation: 'flash-win 0.7s ease',
            }}>
              ✓ SOUND ADVANCES — MUTATION IN PROGRESS
            </div>
          )}

          {/* Eliminated sounds log */}
          {winners.length > 0 && (
            <div style={{
              marginTop: '30px',
              maxWidth: '900px',
              width: '100%',
              background: '#0d0d1a',
              border: '1px solid #222240',
              padding: '16px 20px',
            }}>
              <div style={{
                fontSize: '0.6rem',
                letterSpacing: '4px',
                color: '#555577',
                marginBottom: '10px',
                fontWeight: 900,
              }}>
                THIS ROUND — ADVANCING SOUNDS ({winners.length}/{matchupsInRound})
              </div>
              {winners.map((w, i) => (
                <div key={i} style={{
                  padding: '6px 0',
                  borderBottom: '1px solid #1a1a30',
                  fontSize: '0.7rem',
                  color: '#aaaacc',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}>
                  <span style={{ color: '#FFD700', fontWeight: 900, flexShrink: 0 }}>
                    #{i + 1}
                  </span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Past rounds */}
          {pastRounds.length > 0 && (
            <div style={{
              marginTop: '20px',
              maxWidth: '900px',
              width: '100%',
            }}>
              {pastRounds.map((pr, ri) => (
                <div key={ri} style={{
                  background: '#080810',
                  border: '1px solid #111130',
                  padding: '10px 16px',
                  marginBottom: '8px',
                  opacity: 0.6,
                }}>
                  <div style={{
                    fontSize: '0.55rem',
                    letterSpacing: '4px',
                    color: '#444466',
                    marginBottom: '6px',
                    fontWeight: 900,
                  }}>
                    {roundNames[pr.round]} — COMPLETED
                  </div>
                  <div style={{
                    fontSize: '0.6rem',
                    color: '#333355',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                  }}>
                    {pr.sounds.map((s, si) => (
                      <span key={si} style={{
                        background: '#0d0d1a',
                        padding: '2px 6px',
                        border: '1px solid #1a1a30',
                      }}>
                        {s.split(' ').slice(0, 4).join(' ')}…
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {phase === 'certificate' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 20px 80px',
          animation: 'fade-in 1s ease',
        }}>
          {/* Champion announcement */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
          }}>
            <div style={{
              fontSize: '0.7rem',
              letterSpacing: '8px',
              color: '#FFD700',
              marginBottom: '8px',
              animation: 'champion-pulse 2s ease infinite',
            }}>
              ★ WE HAVE A CHAMPION ★
            </div>
            <div style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 900,
              color: '#FFD700',
              letterSpacing: '4px',
              textShadow: '0 0 30px #FFD70088',
              animation: 'champion-pulse 2s ease infinite',
            }}>
              THE FINAL SOUND
            </div>
          </div>

          {/* Champion sound display */}
          <div style={{
            maxWidth: '900px',
            width: '100%',
            background: 'linear-gradient(135deg, #0d0d1a, #1a0a0a)',
            border: '4px solid #FFD700',
            padding: '30px',
            marginBottom: '40px',
            boxShadow: '0 0 40px #FFD70044',
            overflowX: 'auto',
          }}>
            <div style={{
              fontSize: fontSize(champion),
              fontWeight: 900,
              color: '#ffffff',
              textTransform: 'uppercase',
              lineHeight: 1.6,
              letterSpacing: '0.5px',
              wordBreak: 'break-word',
              animation: 'champion-pulse 3s ease infinite',
            }}>
              {champion}
            </div>
          </div>

          {/* Certificate */}
          <div style={{
            maxWidth: '700px',
            width: '100%',
            background: '#F5F0E8',
            color: '#1a1a1a',
            padding: '50px 60px',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            border: '2px solid #c8b89a',
          }}>
            {/* Certificate border decoration */}
            <div style={{
              position: 'absolute',
              inset: '10px',
              border: '2px solid #8b7355',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              inset: '14px',
              border: '1px solid #c8b89a',
              pointerEvents: 'none',
            }} />

            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: '0.6rem',
                letterSpacing: '6px',
                color: '#8b7355',
                marginBottom: '8px',
                fontFamily: 'Georgia, serif',
              }}>
                WORLD COMPETITIVE LISTENING ASSOCIATION
              </div>
              <div style={{
                fontSize: '0.5rem',
                letterSpacing: '4px',
                color: '#aaa090',
                marginBottom: '20px',
                fontFamily: 'Georgia, serif',
              }}>
                EST. RECENTLY • ACCREDITED BY NO ONE IN PARTICULAR
              </div>

              <div style={{
                width: '80%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #8b7355, transparent)',
                margin: '0 auto 20px',
              }} />

              <div style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: 900,
                letterSpacing: '4px',
                color: '#1a1a1a',
                textTransform: 'uppercase',
                fontFamily: "'Arial Black', sans-serif",
                marginBottom: '6px',
              }}>
                CERTIFICATE OF
              </div>
              <div style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 900,
                letterSpacing: '2px',
                color: '#8b0000',
                textTransform: 'uppercase',
                fontFamily: "'Arial Black', sans-serif",
                textShadow: '2px 2px 0 #c8b89a',
                marginBottom: '20px',
              }}>
                COMPETITIVE LISTENING
              </div>

              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '0.9rem',
                color: '#444430',
                marginBottom: '16px',
                lineHeight: 1.8,
              }}>
                This certifies that
              </div>

              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                fontStyle: 'italic',
                color: '#1a1a1a',
                borderBottom: '2px solid #8b7355',
                paddingBottom: '8px',
                marginBottom: '16px',
                letterSpacing: '2px',
              }}>
                The Listener
              </div>

              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '0.85rem',
                color: '#444430',
                lineHeight: 1.9,
                marginBottom: '20px',
              }}>
                has successfully judged{' '}
                <strong style={{ color: '#8b0000' }}>
                  {initialSounds.length - 1} elimination rounds
                </strong>
                {' '}of the World Competitive Listening Championship,<br />
                demonstrating an ability to choose between sounds<br />
                that do not exist, cannot be verified, and<br />
                are not in agreement about their own nature.
              </div>

              <div style={{
                background: '#1a1a1a',
                color: '#FFD700',
                padding: '12px 20px',
                margin: '0 auto 24px',
                display: 'inline-block',
                fontFamily: "'Arial Black', sans-serif",
                fontSize: '0.7rem',
                fontWeight: 900,
                letterSpacing: '4px',
              }}>
                GRADE: UNCERTAIN
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '30px',
                marginBottom: '20px',
              }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '120px',
                    borderTop: '1px solid #8b7355',
                    margin: '0 auto 4px',
                  }} />
                  <div style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.55rem',
                    color: '#8b7355',
                    letterSpacing: '2px',
                  }}>
                    CHIEF SOUND OFFICIAL
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  {/* Wax seal SVG */}
                  <div style={{
                    position: 'relative',
                    width: '90px',
                    height: '90px',
                    animation: sealDrip < 100 ? 'seal-wobble 2s ease infinite' : 'none',
                    transform: `translateY(${sealDrip * 0.8}px)`,
                    transition: 'transform 0.1s',
                    opacity: sealDrip > 80 ? Math.max(0, 1 - (sealDrip - 80) / 20) : 1,
                  }}>
                    <svg width="90" height="110" viewBox="0 0 90 110">
                      {/* Drip */}
                      <path
                        d={`M 42 78 Q 40 ${78 + sealDrip * 0.3} 45 ${78 + sealDrip * 0.35} Q 50 ${78 + sealDrip * 0.3} 48 78`}
                        fill="#8b0000"
                        opacity={sealDrip > 5 ? 1 : 0}
                      />
                      {/* Main seal circle */}
                      <circle cx="45" cy="45" r="40" fill="#CC0000" />
                      <circle cx="45" cy="45" r="36" fill="none" stroke="#8b0000" strokeWidth="3" />
                      <circle cx="45" cy="45" r="30" fill="none" stroke="#ff4444" strokeWidth="1" opacity="0.5" />
                      {/* Star/emblem */}
                      <text
                        x="45"
                        y="40"
                        textAnchor="middle"
                        fontSize="18"
                        fill="#FFD700"
                        fontWeight="900"
                        fontFamily="Arial Black, sans-serif"
                      >
                        ★
                      </text>
                      <text
                        x="45"
                        y="56"
                        textAnchor="middle"
                        fontSize="6"
                        fill="#FFD700"
                        fontWeight="900"
                        fontFamily="Arial, sans-serif"
                        letterSpacing="1"
                      >
                        WCLA
                      </text>
                    </svg>
                  </div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '120px',
                    borderTop: '1px solid #8b7355',
                    margin: '0 auto 4px',
                  }} />
                  <div style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.55rem',
                    color: '#8b7355',
                    letterSpacing: '2px',
                  }}>
                    COMMISSIONER OF SOUND
                  </div>
                </div>
              </div>

              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '0.55rem',
                color: '#aaa090',
                letterSpacing: '2px',
                marginTop: '10px',
              }}>
                CERTIFICATE NO. {Math.floor(Math.random() * 900000 + 100000)} •
                NOT VALID FOR TAX PURPOSES •
                SOUNDS MAY VARY
              </div>
            </div>
          </div>

          {/* Print button */}
          <button
            onClick={() => window.print()}
            style={{
              marginTop: '30px',
              padding: '16px 40px',
              background: '#FFD700',
              color: '#000000',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 900,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'Arial Black', sans-serif",
              boxShadow: '0 0 20px #FFD70066',
              transition: 'transform 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            ★ PRINT CERTIFICATE ★
          </button>

          <div style={{
            marginTop: '16px',
            fontSize: '0.6rem',
            letterSpacing: '3px',
            color: '#333355',
          }}>
            CERTIFICATE VALIDITY: UNCERTAIN • GRADE: UNCERTAIN • EVERYTHING: UNCERTAIN
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        background: '#050508',
        borderTop: '2px solid #111130',
        padding: '12px 20px',
        textAlign: 'center',
        fontSize: '0.55rem',
        color: '#333355',
        letterSpacing: '3px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      }}>
        WCLA OFFICIAL BROADCAST • ALL SOUNDS PROPERTY OF THEIR RESPECTIVE FREQUENCIES •
        LISTENING RESPONSIBLY SINCE AN INDETERMINATE POINT IN TIME
      </div>
    </div>
  );
}