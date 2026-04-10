import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [surveyDepth, setSurveyDepth] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [systemResponse, setSystemResponse] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [blinkState, setBlinkState] = useState(false);
  const [progressWobble, setProgressWobble] = useState(0);
  const [mascotWorry, setMascotWorry] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [starBlinks, setStarBlinks] = useState([false, false, false, false, false]);
  const responseTimerRef = useRef(null);

  const surveyLayer0 = [
    {
      question: "How satisfied were you with the texture of Tuesday?",
      options: ["Exceptionally smooth", "Adequately textured", "Somewhat granular", "Distressingly coarse", "I was not consulted"]
    },
    {
      question: "Would you recommend being you to a friend?",
      options: ["Warmly", "With enthusiasm tempered by realism", "With reservations", "Only to someone I was neutral about", "I would not do this to a friend"]
    },
    {
      question: "How well did your childhood prepare you for the concept of time?",
      options: ["Excellently", "Sufficiently", "There were gaps in the curriculum", "I filed a complaint but it was noted and archived", "Time and I have reached a detente"]
    },
    {
      question: "Please rate the overall quality of your memories.",
      options: ["Vivid and well-organized", "Functional but cluttered", "Impressionistic at best", "Heavily redacted", "Storage appears to be full"]
    },
    {
      question: "How would you describe your relationship with the concept of 'enough'?",
      options: ["We are close friends", "Cordial acquaintances", "We have not been formally introduced", "It keeps moving", "I have submitted a formal inquiry"]
    },
    {
      question: "Were your feelings adequately sized for the events provided?",
      options: ["Yes, a perfect fit", "Slightly too large", "Slightly too small", "They were the wrong shape entirely", "I would like to speak with a representative"]
    },
    {
      question: "How satisfied are you with the body assigned to you at the start of your experience?",
      options: ["Delighted", "Accepting", "In active negotiation", "The paperwork was unclear", "I was not made aware this was optional"]
    }
  ];

  const surveyLayer1 = [
    {
      question: "How satisfied were you with the questions in the previous survey?",
      options: ["They asked what needed asking", "Mostly relevant", "Some questions seemed personal", "I have questions about the questions", "I would like to speak with the question author"]
    },
    {
      question: "Did the survey adequately capture the nuance of your existence?",
      options: ["Comprehensively", "Partially", "It captured a silhouette", "It captured the shadow of a silhouette", "Existence remains uncaptured"]
    },
    {
      question: "How would you rate the experience of being asked to rate your experience?",
      options: ["Meta but fair", "Slightly vertiginous", "I felt seen in an uncomfortable way", "I felt unseen in a comfortable way", "I require a moment"]
    },
    {
      question: "Were the answer options provided sufficient for your needs?",
      options: ["Yes, they covered the range", "Mostly, with minor gaps", "My actual answer was not listed", "None of these are my answer either", "The answer I need does not have words yet"]
    },
    {
      question: "How likely are you to recommend this survey to someone who also exists?",
      options: ["Very likely", "Likely", "Uncertain", "Unlikely", "I would not do this to someone who exists"]
    }
  ];

  const surveyLayer2 = [
    {
      question: "How satisfied were you with reviewing the survey about your existence?",
      options: ["It brought closure", "It raised new questions", "It raised questions about the new questions", "I am deeper in than I planned", "Closure has been rescheduled"]
    },
    {
      question: "Did the meta-survey help you process the original survey?",
      options: ["Yes, I feel processed", "Somewhat processed", "I am in a processing queue", "Processing has stalled", "I have exited the processing entirely"]
    },
    {
      question: "How would you rate the overall arc of your survey experience so far?",
      options: ["Satisfying narrative structure", "Interesting but unresolved", "I sense there is no ending", "I have made peace with the structure", "I have made peace with the lack of structure"]
    },
    {
      question: "Were you adequately prepared for this level of recursion?",
      options: ["I was born ready", "I adapted quickly", "I am adapting", "Adaptation is ongoing", "I have submitted a request for preparation materials"]
    },
    {
      question: "Do you feel this survey is moving toward something?",
      options: ["Yes, resolution feels near", "Something is approaching, unclear what", "The horizon is moving at my speed", "I have stopped watching the horizon", "I have become the horizon"]
    }
  ];

  const deepTemplates = [
    (d) => ({
      question: `How satisfied were you with your satisfaction rating of the survey about your satisfaction rating? (Layer ${d})`,
      options: ["Recursively satisfied", "Satisfied with reservations about the recursion", "The recursion is noted", "I have stopped counting layers", "I am the survey now"]
    }),
    (d) => ({
      question: `Please rate the quality of this question, which is about rating quality. (Depth: ${d})`,
      options: ["It has integrity", "Questionable integrity", "The integrity has folded", "Integrity is a construct I once knew", "I rate it a question"]
    }),
    (d) => ({
      question: `How are you holding up? (This is survey layer ${d}.)`,
      options: ["Admirably", "Surprisingly well", "I have developed coping mechanisms", "The coping mechanisms have their own survey", "I am the coping mechanism"]
    }),
    (d) => ({
      question: `Do you feel that this experience is building toward meaning? (Iteration ${d})`,
      options: ["Yes, meaning is imminent", "Meaning is in a holding pattern", "Meaning has been rerouted", "I have redefined meaning to include this", "This is the meaning now"]
    }),
    (d) => ({
      question: `How would you rate your ability to continue completing surveys? (Survey ${d})`,
      options: ["Indefinitely capable", "Capable with breaks", "Capability is waning but present", "I continue out of politeness", "I continue because what else is there"]
    })
  ];

  const systemResponses = [
    "Thank you. This feedback has been noted and will affect nothing.",
    "Your response has been recorded. The universe is grateful for your time.",
    "Acknowledged. This information will be filed under 'Known Issues.'",
    "Thank you. Your experience has been validated and immediately archived.",
    "Noted. A representative will not be in touch.",
    "This response has been logged. No further action is required from anyone.",
    "Your feedback is important to us. It has been placed in the appropriate queue.",
    "Thank you for your honesty. It will be kept somewhere safe.",
    "Recorded. The Management appreciates your continued participation in existence.",
    "This has been noted. Please proceed. There is always a next question.",
    "Acknowledged. Your feelings have been assigned a ticket number.",
    "Thank you. This data point will contribute to a report no one will read.",
    "Your input is valued. It has been valued and set aside.",
    "Noted with appreciation. The appreciation is also noted.",
  ];

  const getQuestionsForDepth = (depth) => {
    if (depth === 0) return surveyLayer0;
    if (depth === 1) return surveyLayer1;
    if (depth === 2) return surveyLayer2;
    const templateIndex = (depth - 3) % deepTemplates.length;
    return Array.from({ length: 4 }, (_, i) => deepTemplates[(templateIndex + i) % deepTemplates.length](depth));
  };

  const currentQuestions = getQuestionsForDepth(surveyDepth);
  const totalQuestions = currentQuestions.length;
  const currentQ = currentQuestions[currentQuestion] || currentQuestions[0];

  useEffect(() => {
    const interval = setInterval(() => {
      const newBlinks = [0, 1, 2, 3, 4].map(() => Math.random() < 0.3);
      setStarBlinks(newBlinks);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = Math.min(92, 10 + (currentQuestion / totalQuestions) * 82 + surveyDepth * 0.5);
    const jitter = (Math.random() - 0.5) * 2;
    setProgressWobble(Math.min(94, target + jitter));
  }, [currentQuestion, surveyDepth, totalQuestions]);

  useEffect(() => {
    setMascotWorry(Math.min(3, surveyDepth));
  }, [surveyDepth]);

  const handleConfirm = () => {
    if (!selectedAnswer) return;
    const responseIndex = Math.floor(Math.random() * systemResponses.length);
    setSystemResponse(systemResponses[responseIndex]);
    setAnswers(prev => [...prev, selectedAnswer]);
    setSelectedAnswer(null);

    if (responseTimerRef.current) clearTimeout(responseTimerRef.current);
    responseTimerRef.current = setTimeout(() => {
      setSystemResponse(null);
      if (currentQuestion + 1 >= totalQuestions) {
        setTransitioning(true);
        setTimeout(() => {
          setSurveyDepth(prev => prev + 1);
          setCurrentQuestion(0);
          setAnswers([]);
          setTransitioning(false);
        }, 1800);
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 2500);
  };

  const getSurveyTitle = () => {
    if (surveyDepth === 0) return "Existence Satisfaction Survey";
    if (surveyDepth === 1) return "Survey Experience Review";
    if (surveyDepth === 2) return "Review of the Survey Experience Review";
    return `Review of the Review (Layer ${surveyDepth})`;
  };

  const getSurveySubtitle = () => {
    if (surveyDepth === 0) return "Issued by: The Management • Reference: YOUR LIFE • Status: Ongoing";
    if (surveyDepth === 1) return "Because your feedback deserves its own feedback";
    if (surveyDepth === 2) return "We need to know how you felt about telling us how you felt";
    return `We appreciate your continued participation. (Depth: ${surveyDepth})`;
  };

  const eyeY = 38 - mascotWorry * 3;
  const eyeSize = 3 + mascotWorry * 0.5;
  const mouthPath = mascotWorry === 0
    ? "M 28 52 Q 36 58 44 52"
    : mascotWorry === 1
    ? "M 28 54 Q 36 54 44 54"
    : mascotWorry === 2
    ? "M 28 56 Q 36 52 44 56"
    : "M 27 58 Q 36 50 45 58";

  const starColors = ["#FFE566", "#FFE566", "#FFE566", "#FFE566", "#FFE566"];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E8E4F0 0%, #F0EDF8 50%, #E4EDF0 100%)',
      fontFamily: 'system-ui, -apple-system, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '40px 20px',
    }}>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes progressJitter {
          0% { width: var(--pw); }
          50% { width: calc(var(--pw) + 0.4%); }
          100% { width: var(--pw); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes worryBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '28px',
        animation: 'fadeIn 0.6s ease',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginBottom: '12px',
        }}>
          {starColors.map((color, i) => (
            <span key={i} style={{
              fontSize: '28px',
              color: color,
              display: 'inline-block',
              animation: starBlinks[i] ? `blink 0.4s ease ${i * 0.06}s` : 'none',
              filter: 'drop-shadow(0 0 4px rgba(255, 220, 80, 0.5))',
              transition: 'opacity 0.1s',
            }}>★</span>
          ))}
        </div>
        <h1 style={{
          fontSize: '13px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#9B8EC4',
          margin: '0 0 4px 0',
          fontWeight: '600',
        }}>THE MANAGEMENT</h1>
        <p style={{
          fontSize: '11px',
          color: '#B5A8D4',
          margin: 0,
          letterSpacing: '1px',
        }}>Customer Experience Division • Est. Before You</p>
      </div>

      {/* Main Card */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 8px 40px rgba(123, 104, 170, 0.12), 0 2px 8px rgba(123, 104, 170, 0.08)',
        padding: '40px',
        maxWidth: '580px',
        width: '100%',
        animation: transitioning ? 'fadeOut 0.5s ease forwards' : 'fadeIn 0.5s ease',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Depth indicator stripe */}
        {surveyDepth > 0 && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, #C4B8E8 0%, #A899D0 ${Math.min(100, surveyDepth * 20)}%, #E8E4F0 100%)`,
          }} />
        )}

        {/* Survey Title Section */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '10px',
          }}>
            {/* Mascot */}
            <div style={{
              animation: mascotWorry > 1 ? 'worryBob 2s ease-in-out infinite' : 'none',
              flexShrink: 0,
            }}>
              <svg width="56" height="72" viewBox="0 0 72 80">
                <ellipse cx="36" cy="48" rx="26" ry="30" fill="#E8E4F0" stroke="#C4B8E8" strokeWidth="2"/>
                <circle cx="27" cy={eyeY} r={eyeSize} fill="#7B68AA"/>
                <circle cx="45" cy={eyeY} r={eyeSize} fill="#7B68AA"/>
                {mascotWorry >= 2 && (
                  <>
                    <circle cx="25" cy={eyeY - 4} r="1.5" fill="#B5A8D4" opacity="0.6"/>
                    <circle cx="43" cy={eyeY - 4} r="1.5" fill="#B5A8D4" opacity="0.6"/>
                  </>
                )}
                <path d={mouthPath} stroke="#9B8EC4" strokeWidth="2" fill="none" strokeLinecap="round"/>
                {mascotWorry >= 3 && (
                  <text x="36" y="72" textAnchor="middle" fontSize="8" fill="#B5A8D4">...</text>
                )}
              </svg>
            </div>
            <div>
              <h2 style={{
                margin: '0 0 4px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#3D3060',
                lineHeight: 1.2,
              }}>{getSurveyTitle()}</h2>
              <p style={{
                margin: 0,
                fontSize: '11px',
                color: '#B5A8D4',
                letterSpacing: '0.5px',
              }}>{getSurveySubtitle()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}>
              <span style={{ fontSize: '11px', color: '#B5A8D4' }}>
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <span style={{ fontSize: '11px', color: '#B5A8D4' }}>
                {Math.round(progressWobble)}% complete
              </span>
            </div>
            <div style={{
              height: '6px',
              background: '#F0EDF8',
              borderRadius: '3px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progressWobble}%`,
                background: 'linear-gradient(90deg, #C4B8E8, #9B8EC4)',
                borderRadius: '3px',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}/>
            </div>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '10px',
              color: '#D4CCEC',
              fontStyle: 'italic',
            }}>* Progress indicator is approximate and non-binding</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #E8E4F0, transparent)',
          marginBottom: '28px',
        }}/>

        {/* Question */}
        <div style={{
          marginBottom: '24px',
          animation: 'slideIn 0.4s ease',
          key: `${surveyDepth}-${currentQuestion}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            marginBottom: '20px',
          }}>
            <span style={{
              background: '#E8E4F0',
              color: '#7B68AA',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
              flexShrink: 0,
              marginTop: '1px',
            }}>{currentQuestion + 1}</span>
            <p style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: '500',
              color: '#3D3060',
              lineHeight: 1.5,
            }}>{currentQ.question}</p>
          </div>

          {/* Answer Options */}
          <div style={{ paddingLeft: '38px' }}>
            {currentQ.options.map((option, i) => (
              <label key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                marginBottom: '8px',
                borderRadius: '10px',
                cursor: 'pointer',
                background: selectedAnswer === option ? '#F0EDF8' : 'transparent',
                border: `2px solid ${selectedAnswer === option ? '#C4B8E8' : '#F0EDF8'}`,
                transition: 'all 0.15s ease',
                animation: `slideIn 0.3s ease ${i * 0.05}s both`,
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: `2px solid ${selectedAnswer === option ? '#7B68AA' : '#D4CCEC'}`,
                  background: selectedAnswer === option ? '#7B68AA' : 'white',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}>
                  {selectedAnswer === option && (
                    <div style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: 'white',
                    }}/>
                  )}
                </div>
                <input
                  type="radio"
                  name={`q-${surveyDepth}-${currentQuestion}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  style={{ display: 'none' }}
                />
                <span style={{
                  fontSize: '14px',
                  color: selectedAnswer === option ? '#3D3060' : '#6B5F8C',
                  fontWeight: selectedAnswer === option ? '500' : '400',
                  transition: 'all 0.15s ease',
                }}>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* System Response */}
        {systemResponse && (
          <div style={{
            background: 'linear-gradient(135deg, #E8F5EE, #EFF8F3)',
            border: '1px solid #C4E0D0',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '20px',
            animation: 'fadeIn 0.3s ease',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}>
            <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>✓</span>
            <div>
              <p style={{
                margin: '0 0 2px 0',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#5A9E7A',
              }}>Automated Response</p>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#3D7A5A',
                lineHeight: 1.5,
                fontStyle: 'italic',
              }}>{systemResponse}</p>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        {selectedAnswer && !systemResponse && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <button
              onClick={handleConfirm}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #9B8EC4, #7B68AA)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(123, 104, 170, 0.3)',
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 20px rgba(123, 104, 170, 0.4)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(123, 104, 170, 0.3)';
              }}
            >
              Submit Response →
            </button>
          </div>
        )}

        {/* Transitioning message */}
        {transitioning && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#9B8EC4',
              fontStyle: 'italic',
              margin: 0,
            }}>Survey complete. Preparing follow-up survey...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '28px',
        textAlign: 'center',
        maxWidth: '580px',
      }}>
        {surveyDepth > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '10px',
            flexWrap: 'wrap',
          }}>
            {Array.from({ length: Math.min(surveyDepth, 8) }).map((_, i) => (
              <span key={i} style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: i === surveyDepth - 1 ? '#9B8EC4' : '#D4CCEC',
                display: 'inline-block',
                transition: 'all 0.3s ease',
              }}/>
            ))}
            {surveyDepth > 8 && (
              <span style={{ fontSize: '11px', color: '#B5A8D4' }}>+{surveyDepth - 8} more</span>
            )}
          </div>
        )}
        <p style={{
          fontSize: '11px',
          color: '#C4B8E8',
          margin: 0,
          letterSpacing: '0.5px',
        }}>
          © The Management • Your responses are confidential and meaningless • Have a productive existence
        </p>
        {surveyDepth >= 3 && (
          <p style={{
            fontSize: '10px',
            color: '#D4CCEC',
            margin: '6px 0 0 0',
            fontStyle: 'italic',
          }}>
            You have now completed {surveyDepth} surveys. This is not unusual. Please continue.
          </p>
        )}
      </div>
    </div>
  );
}