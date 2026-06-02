var MATH_L1 = {

en: '<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div><p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p><ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none"><li><a href="/tutorials/matematik/40" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Functions</a> <span style="opacity:0.55;font-size:0.82em">(Math L40)</span></li><li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrices</a> <span style="opacity:0.55;font-size:0.82em">(Math L72)</span></li><li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Probability Basics</a> <span style="opacity:0.55;font-size:0.82em">(Math L94)</span></li><li><a href="/tutorials/matematik/101" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Expected Value &amp; Variance</a> <span style="opacity:0.55;font-size:0.82em">(Math L101)</span></li></ul></div><p class="l-text"><strong>Probability is the language of uncertainty.</strong> Every prediction a machine learning model makes comes with uncertainty, and probability gives us the mathematical framework to reason about it rigorously. From spam filters to language models, from medical diagnosis to speech recognition \u2014 probability is the foundation upon which all of ML and AI are built.</p>'

+ '<p class="l-text">Language itself is inherently probabilistic: the word that comes next in a sentence depends on context, ambiguity, and intention. When GPT generates text, it is literally sampling from a probability distribution over words. This lesson builds your probability intuition from scratch \u2014 every symbol explained, every concept connected to ML.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">\ud83d\udccd WHAT YOU\u2019LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>State the three Kolmogorov axioms that all of probability is built on</li>'
+ '<li>Compute joint, conditional, and marginal probabilities from a contingency table</li>'
+ '<li>Apply Bayes\\\' theorem to a real medical-test problem and explain the prior</li>'
+ '<li>Distinguish discrete and continuous random variables and their PMF/PDF</li>'
+ '<li>Identify Bernoulli, Binomial, Gaussian, and Poisson distributions in ML data</li>'
+ '<li>Connect maximum likelihood estimation to a model\\\'s training loss function</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   SECTION 1: Why Probability?
   ============================================================ */
+ '<h2 class="l-title">1. Why Probability?</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> When you check the weather forecast and see "70% chance of rain," that is probability in action. The forecaster does not say "it will rain" or "it won\'t rain" \u2014 they quantify their <em>uncertainty</em>. Machine learning models do exactly the same thing: instead of giving a single answer, they assign probabilities to every possible outcome.</div>'

+ '<p class="l-text">Why does ML need probability? Because the real world is noisy, ambiguous, and uncertain:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Noisy Data</div><div class="card-body">Sensors have errors, labels are wrong, measurements are imprecise. Probability lets us <strong>model noise</strong> and still make good predictions.</div></div>'
+ '<div class="calc-card"><div class="card-title">Ambiguity</div><div class="card-body">"Bank" = river bank or financial bank? Language is full of ambiguity. NLP models use probability to pick the most likely meaning from <strong>context</strong>.</div></div>'
+ '<div class="calc-card"><div class="card-title">Partial Information</div><div class="card-body">We never have all the data. Probability lets us make the <strong>best possible inference</strong> given what we know \u2014 that is Bayesian reasoning.</div></div>'
+ '<div class="calc-card"><div class="card-title">Generalization</div><div class="card-body">A model trained on 1M sentences must work on sentences it has never seen. Probability theory tells us <strong>when and why</strong> generalization is possible.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Probability in NLP specifically:</strong></p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Language Models</div><div class="step-detail">GPT computes P(next word | previous words). The entire generation process is repeated sampling from conditional probability distributions.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Text Classification</div><div class="step-detail">Spam filters compute P(spam | email text) using Bayes\' theorem. Naive Bayes is literally named after a probability rule.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Machine Translation</div><div class="step-detail">Translation models compute P(target sentence | source sentence) and find the most probable translation.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Information Theory</div><div class="step-detail">Cross-entropy loss (the loss function for classification) is directly derived from probability and information theory.</div></div></div>'
+ '</div>'

+ '<div class="l-note"><strong>ML Connection:</strong> The softmax function at the end of every classification neural network converts raw scores into a probability distribution. When you see softmax(z) = [0.7, 0.2, 0.1], that means the model assigns 70% probability to class 1, 20% to class 2, and 10% to class 3. This is probability in its purest form.</div>'

/* ============================================================
   SECTION 2: Sample Space & Events
   ============================================================ */
+ '<h2 class="l-title">2. Sample Space & Events</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> When you roll a die, the possible outcomes are {1, 2, 3, 4, 5, 6}. That set of all possible outcomes is the <em>sample space</em>. An "event" is a question like "did I roll an even number?" \u2014 which corresponds to the subset {2, 4, 6}.</div>'

+ '<p class="l-text">Before we can assign probabilities, we need to define precisely what outcomes are possible and what questions we can ask. This is where set theory meets probability:</p>'

+ '<div class="calc-formula"><div class="formula-label">FUNDAMENTAL DEFINITIONS</div><div class="formula-main">$$\\text{Experiment} \\to \\text{Sample Space } S \\to \\text{Events } A, B \\subseteq S$$</div><div class="formula-sub">An experiment produces outcomes. The set of all outcomes is S. Any subset of S is an event.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Sample Space</div><div class="card-body">The set of <strong>all possible outcomes</strong> of an experiment. Also written as \u03a9 (omega). Must be exhaustive \u2014 nothing is left out.</div></div>'
+ '<div class="calc-card"><div class="card-title">Outcome</div><div class="card-body">A single result. For a coin flip: \u03c9 \u2208 {H, T}. For NLP: a single word from the vocabulary is an outcome.</div></div>'
+ '<div class="calc-card"><div class="card-title">Event</div><div class="card-body">Any <strong>subset</strong> of S. "Rolling even" = {2,4,6}. "Model predicts positive" = subset of all possible predictions.</div></div>'
+ '<div class="calc-card"><div class="card-title">Empty Event</div><div class="card-body">The impossible event \u2014 no outcomes. P(\u2205) = 0. Example: rolling a 7 on a standard die.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Set operations on events:</strong> Since events are sets, we can combine them:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">UNION: A \u222a B</div><div class="compare-item">\u2022 "A <strong>or</strong> B (or both)"</div><div class="compare-item">\u2022 All outcomes in at least one event</div><div class="compare-item">\u2022 Example: even OR > 4 = {2,4,5,6}</div></div><div class="compare-col"><div class="compare-title">INTERSECTION: A \u2229 B</div><div class="compare-item">\u2022 "A <strong>and</strong> B (both)"</div><div class="compare-item">\u2022 Only outcomes in both events</div><div class="compare-item">\u2022 Example: even AND > 4 = {6}</div></div></div>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">COMPLEMENT: A\u1d9c</div><div class="compare-item">\u2022 "<strong>not</strong> A"</div><div class="compare-item">\u2022 All outcomes NOT in A</div><div class="compare-item">\u2022 Example: not even = {1,3,5}</div></div><div class="compare-col"><div class="compare-title">DIFFERENCE: A \\ B</div><div class="compare-item">\u2022 "A but <strong>not</strong> B"</div><div class="compare-item">\u2022 Outcomes in A that are not in B</div><div class="compare-item">\u2022 Example: even but NOT >4 = {2,4}</div></div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>NLP Sample Space:</strong> Consider a simple vocabulary V = {"the", "cat", "sat", "on", "mat"}.<br><br>Sample space for next word prediction: S = V = {"the", "cat", "sat", "on", "mat"}<br><br>Event A = "word starts with a consonant" = {"cat", "sat", "mat"}<br>Event B = "word has 3 letters" = {"the", "cat", "sat", "mat"}<br><br>A \u2229 B = {"cat", "sat", "mat"} (consonant-start AND 3 letters)<br>A \u222a B = {"the", "cat", "sat", "mat"} (consonant-start OR 3 letters)<br>A\u1d9c = {"the", "on"} (does NOT start with consonant)</div></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">In language modeling, the sample space is the entire vocabulary. GPT-4 has a vocabulary of ~100,000 tokens. Every time it generates the next token, it assigns a probability to each of those 100,000 outcomes. The sample space is massive!</div></div>'

/* ============================================================
   SECTION 3: Probability Axioms
   ============================================================ */
+ '<h2 class="l-title">3. Probability Axioms</h2>'

+ '<div class="calc-highlight"><strong>Key insight:</strong> Probability is not just "gut feeling." It is a <em>mathematical system</em> built on three simple axioms (rules). Every probability formula, theorem, and ML algorithm follows from these three axioms. They were formalized by Andrey Kolmogorov in 1933.</div>'

+ '<p class="l-text">A <strong>probability function</strong> P assigns a number to every event, satisfying three axioms:</p>'

+ '<div class="calc-formula"><div class="formula-label">AXIOM 1: NON-NEGATIVITY</div><div class="formula-main">$$P(A) \\geq 0 \\quad \\text{for every event } A$$</div><div class="formula-sub">Probabilities are never negative. You cannot have a -30% chance of something.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">AXIOM 2: NORMALIZATION</div><div class="formula-main">$$P(S) = 1$$</div><div class="formula-sub">The probability that SOMETHING happens is 1 (100%). The sample space covers all possibilities.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">AXIOM 3: ADDITIVITY</div><div class="formula-main">$$\\text{If } A \\cap B = \\emptyset, \\text{ then } P(A \\cup B) = P(A) + P(B)$$</div><div class="formula-sub">For mutually exclusive events (no overlap), probabilities add up.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Non-negative</div><div class="card-body">Every probability is between 0 and 1 inclusive. 0 = impossible, 1 = certain. This bounds all our computations.</div></div>'
+ '<div class="calc-card"><div class="card-title">Normalized</div><div class="card-body">Probabilities over all outcomes sum to 1. In softmax: [0.7, 0.2, 0.1] sums to 1.0. This is <strong>why</strong> softmax works as a probability distribution.</div></div>'
+ '<div class="calc-card"><div class="card-title">Additive</div><div class="card-body">For non-overlapping events, just add. P(1 or 2 on a die) = P(1) + P(2) = 1/6 + 1/6 = 1/3.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Key consequences</strong> that follow from these three axioms:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Complement Rule</div><div class="step-detail">P(A\u1d9c) = 1 - P(A). If there is a 30% chance of rain, there is a 70% chance of no rain. Proof: A \u222a A\u1d9c = S and they are disjoint, so P(A) + P(A\u1d9c) = P(S) = 1.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Bound</div><div class="step-detail">0 \u2264 P(A) \u2264 1 for all events A. Follows from non-negativity and the complement rule.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Inclusion-Exclusion</div><div class="step-detail">P(A \u222a B) = P(A) + P(B) - P(A \u2229 B). When events overlap, subtract the double-counted intersection.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Monotonicity</div><div class="step-detail">If A \u2286 B, then P(A) \u2264 P(B). A subset cannot be more probable than the set containing it.</div></div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">INCLUSION-EXCLUSION PRINCIPLE</div><div class="formula-main">$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$</div><div class="formula-sub">For ANY two events (not just disjoint). Subtract the overlap to avoid double-counting.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>A spam filter has these probabilities:</strong><br><br>P(contains "free") = 0.3<br>P(contains "win") = 0.2<br>P(contains both "free" and "win") = 0.1<br><br>P(contains "free" OR "win") = 0.3 + 0.2 - 0.1 = <strong>0.4</strong><br>P(contains neither) = 1 - 0.4 = <strong>0.6</strong></div></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> The softmax function guarantees all three axioms: outputs are non-negative (exponentials are always positive), they sum to 1 (normalization), and for one-hot classification, they are mutually exclusive. This is why softmax produces a valid probability distribution.</div>'

/* ============================================================
   SECTION 4: Conditional Probability
   ============================================================ */
+ '<h2 class="l-title">4. Conditional Probability</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> Knowing that the ground is wet changes your estimate of whether it rained. Before looking outside, you might say "30% chance it rained last night." After seeing wet ground, you update: "maybe 80% now." This updating based on new information is <em>conditional probability</em>.</div>'

+ '<p class="l-text">Conditional probability answers: <strong>"Given that B happened, what is the probability of A?"</strong> This is the most important concept in ML \u2014 almost everything in machine learning is a conditional probability.</p>'

+ '<div class="calc-formula"><div class="formula-label">CONDITIONAL PROBABILITY</div><div class="formula-main">$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0$$</div><div class="formula-sub">Read: "Probability of A given B." We restrict the sample space to only outcomes where B occurred, then check how many of those also have A.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">A given B</div><div class="card-body">The probability of A, knowing that B has occurred. The vertical bar "|" means "given" or "conditioned on."</div></div>'
+ '<div class="calc-card"><div class="card-title">Joint Probability</div><div class="card-body">The probability that both A and B occur together. This is the numerator.</div></div>'
+ '<div class="calc-card"><div class="card-title">Marginal of B</div><div class="card-body">The total probability of B, regardless of A. This is the denominator \u2014 it normalizes relative to B.</div></div>'
+ '</div>'

/* --- Plotly: Venn Diagram for Conditional Probability --- */
+ '<div id="plot-venn-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var thetaA=[];var rA=[];for(var i=0;i<=360;i++){var a=i*Math.PI/180;thetaA.push(a);rA.push(1);}'
+ 'var xA=[];var yA=[];for(var i=0;i<thetaA.length;i++){xA.push(-0.4+1.2*Math.cos(thetaA[i]));yA.push(1.2*Math.sin(thetaA[i]));}'
+ 'var xB=[];var yB=[];for(var i=0;i<thetaA.length;i++){xB.push(0.4+1.2*Math.cos(thetaA[i]));yB.push(1.2*Math.sin(thetaA[i]));}'
+ 'var tA={x:xA,y:yA,mode:"lines",name:"Event A",line:{color:"#c8a96e",width:2.5},fill:"toself",fillcolor:"rgba(200,169,110,0.15)"};'
+ 'var tB={x:xB,y:yB,mode:"lines",name:"Event B",line:{color:"#4ecdc4",width:2.5},fill:"toself",fillcolor:"rgba(78,205,196,0.15)"};'
+ 'var ann=[{x:-0.9,y:0,text:"A",showarrow:false,font:{color:"#c8a96e",size:20}},{x:0.9,y:0,text:"B",showarrow:false,font:{color:"#4ecdc4",size:20}},{x:0,y:0,text:"A\u2229B",showarrow:false,font:{color:"#f87171",size:16}},{x:-2.2,y:1.8,text:"Sample Space S",showarrow:false,font:{color:"#ebe6dc",size:13}}];'
+ 'var layout={title:{text:"Venn Diagram: Conditional Probability P(A|B)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.03)",zerolinecolor:"rgba(255,255,255,0.08)",range:[-2.5,2.5],showticklabels:false,showgrid:false},yaxis:{gridcolor:"rgba(255,255,255,0.03)",zerolinecolor:"rgba(255,255,255,0.08)",range:[-2,2.2],showticklabels:false,showgrid:false,scaleanchor:"x"},annotations:ann,margin:{t:50,r:30,b:30,l:30},showlegend:true,legend:{font:{color:"#ebe6dc"}},shapes:[{type:"rect",x0:-2.5,y0:-2,x1:2.5,y1:2.2,line:{color:"rgba(255,255,255,0.2)",width:1}}]};'
+ 'Plotly.newPlot("plot-venn-en",[tA,tB],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Two overlapping circles represent events A and B inside sample space S. The overlap region is A\u2229B. P(A|B) focuses only on the B circle and asks: what fraction of B is also A? Mathematically: P(A\u2229B) / P(B).</div></div>'

+ '<p class="l-text"><strong>Chain Rule of Probability:</strong> Rearranging the conditional probability formula gives us the chain rule, which is essential for decomposing joint probabilities:</p>'

+ '<div class="calc-formula"><div class="formula-label">CHAIN RULE (PRODUCT RULE)</div><div class="formula-main">$$P(A \\cap B) = P(A|B) \\cdot P(B) = P(B|A) \\cdot P(A)$$</div><div class="formula-sub">The joint probability of A and B equals the conditional times the marginal. Works both ways.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">CHAIN RULE (GENERAL)</div><div class="formula-main">$$P(A_1 \\cap A_2 \\cap \\cdots \\cap A_n) = P(A_1) \\cdot P(A_2|A_1) \\cdot P(A_3|A_1,A_2) \\cdots$$</div><div class="formula-sub">For multiple events: multiply successive conditionals. Language models use exactly this to decompose sentence probability.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Language model chain rule:</strong> P("the cat sat") = ?<br><br>P("the cat sat") = P("the") \u00b7 P("cat"|"the") \u00b7 P("sat"|"the cat")<br><br>Suppose: P("the") = 0.07, P("cat"|"the") = 0.02, P("sat"|"the cat") = 0.15<br><br>P("the cat sat") = 0.07 \u00d7 0.02 \u00d7 0.15 = <strong>0.00021</strong><br><br>This is exactly how autoregressive language models (GPT) generate text \u2014 word by word, each conditioned on all previous words.</div></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> Every autoregressive language model (GPT, LLaMA) decomposes sentence probability using the chain rule: P(w\u2081, w\u2082, ..., w\u2099) = \u220f P(w\u1d62 | w\u2081, ..., w\u1d62\u208b\u2081). Training maximizes this probability over the training corpus. This is the mathematical core of modern NLP.</div>'

/* ============================================================
   SECTION 5: Bayes' Theorem
   ============================================================ */
+ '<h2 class="l-title">5. Bayes\' Theorem</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> A medical test is 99% accurate. You test positive. Does that mean there is a 99% chance you have the disease? <strong>No!</strong> If the disease is rare (1 in 10,000 people), most positives are false positives. Bayes\' theorem tells you the <em>actual</em> probability by combining the test accuracy with how rare the disease is.</div>'

+ '<p class="l-text">Bayes\' theorem is perhaps the single most important formula in all of machine learning. It tells us how to <strong>update our beliefs</strong> when we observe new evidence:</p>'

+ '<div class="calc-formula"><div class="formula-label">BAYES\' THEOREM</div><div class="formula-main">$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$</div><div class="formula-sub">The posterior probability of A given evidence B equals the likelihood times the prior, divided by the evidence.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Posterior</div><div class="card-body"><strong>What we want:</strong> the updated probability of A after seeing evidence B. "After seeing symptoms, what is the probability of disease?"</div></div>'
+ '<div class="calc-card"><div class="card-title">Likelihood</div><div class="card-body"><strong>How likely is the evidence if A is true?</strong> "If you have the disease, what is the probability you show symptoms?" This is what the model computes.</div></div>'
+ '<div class="calc-card"><div class="card-title">Prior</div><div class="card-body"><strong>Belief before evidence.</strong> "What percentage of people have the disease?" Our initial assumption before seeing any data.</div></div>'
+ '<div class="calc-card"><div class="card-title">Evidence (Marginal)</div><div class="card-body"><strong>How common is the evidence overall?</strong> Normalizes the result so it is a valid probability. Often computed via total probability.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">LAW OF TOTAL PROBABILITY</div><div class="formula-main">$$P(B) = P(B|A) \\cdot P(A) + P(B|A^c) \\cdot P(A^c)$$</div><div class="formula-sub">Compute P(B) by summing over all possible "causes" (A and not-A). This gives us the denominator for Bayes\' theorem.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Spam Detection with Bayes\' Theorem:</strong><br><br>Given:<br>\u2022 P(spam) = 0.3 (30% of emails are spam) \u2190 prior<br>\u2022 P("free" | spam) = 0.8 (80% of spam contains "free") \u2190 likelihood<br>\u2022 P("free" | not spam) = 0.1 (10% of legit emails contain "free")<br><br>Step 1: Compute P("free") using total probability:<br>P("free") = P("free"|spam)\u00b7P(spam) + P("free"|not spam)\u00b7P(not spam)<br>= 0.8 \u00d7 0.3 + 0.1 \u00d7 0.7 = 0.24 + 0.07 = <strong>0.31</strong><br><br>Step 2: Apply Bayes\' theorem:<br>P(spam | "free") = P("free"|spam) \u00d7 P(spam) / P("free")<br>= 0.8 \u00d7 0.3 / 0.31 = 0.24 / 0.31 = <strong>0.774</strong><br><br>Seeing "free" updates our belief from 30% to 77.4% \u2014 a big jump!</div></div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">Prior</div><div class="flow-value">P(spam) = 0.30</div></div>'
+ '<div class="flow-arrow">\u2192</div>'
+ '<div class="flow-step"><div class="flow-label">+ Evidence</div><div class="flow-value">"free" observed</div></div>'
+ '<div class="flow-arrow">\u2192</div>'
+ '<div class="flow-step"><div class="flow-label">Posterior</div><div class="flow-value">P(spam|"free") = 0.77</div></div>'
+ '</div>'

+ '<div class="l-note"><strong>ML Connection:</strong> Naive Bayes classifiers use Bayes\' theorem directly. BERT and GPT also implicitly perform Bayesian reasoning \u2014 they update internal representations based on observed tokens (evidence). The entire field of Bayesian ML is built on this single formula.</div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">In the medical test example: disease prevalence = 0.01%, test sensitivity = 99%, false positive rate = 1%. If you test positive, P(disease|positive) = 0.99 \u00d7 0.0001 / (0.99 \u00d7 0.0001 + 0.01 \u00d7 0.9999) \u2248 0.0098 \u2248 <strong>1%</strong>. Despite a 99% accurate test, only 1% of positives are true! This is the base rate fallacy \u2014 and Bayes\' theorem is the cure.</div></div>'

/* ============================================================
   SECTION 6: Independence
   ============================================================ */
+ '<h2 class="l-title">6. Independence</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> Flipping a coin and rolling a die are independent \u2014 the coin result tells you nothing about the die. But drawing two cards from a deck without replacement is NOT independent \u2014 drawing an ace first changes the probability of drawing an ace second.</div>'

+ '<p class="l-text">Two events are <strong>independent</strong> if knowing one gives you <em>no information</em> about the other. Mathematically:</p>'

+ '<div class="calc-formula"><div class="formula-label">INDEPENDENCE DEFINITION</div><div class="formula-main">$$P(A \\cap B) = P(A) \\cdot P(B)$$</div><div class="formula-sub">A and B are independent if and only if the joint probability equals the product of marginals.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">EQUIVALENT DEFINITION</div><div class="formula-main">$$P(A|B) = P(A) \\quad \\text{and} \\quad P(B|A) = P(B)$$</div><div class="formula-sub">Knowing B does not change the probability of A, and vice versa.</div></div>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">INDEPENDENT</div><div class="compare-item">\u2022 P(A\u2229B) = P(A)\u00b7P(B)</div><div class="compare-item">\u2022 P(A|B) = P(A)</div><div class="compare-item">\u2022 Knowing B gives NO info about A</div><div class="compare-item">\u2022 Example: separate coin flips</div></div><div class="compare-col"><div class="compare-title">DEPENDENT</div><div class="compare-item">\u2022 P(A\u2229B) \u2260 P(A)\u00b7P(B)</div><div class="compare-item">\u2022 P(A|B) \u2260 P(A)</div><div class="compare-item">\u2022 Knowing B CHANGES probability of A</div><div class="compare-item">\u2022 Example: consecutive words in a sentence</div></div></div>'

+ '<p class="l-text"><strong>Conditional Independence:</strong> Events can be conditionally independent given a third variable, even if they are not marginally independent:</p>'

+ '<div class="calc-formula"><div class="formula-label">CONDITIONAL INDEPENDENCE</div><div class="formula-main">$$P(A \\cap B | C) = P(A|C) \\cdot P(B|C)$$</div><div class="formula-sub">A and B are conditionally independent given C. Knowing C, A gives no extra information about B.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Naive Bayes assumption:</strong> In a spam classifier with features x\u2081="free", x\u2082="win", x\u2083="click":<br><br>The "naive" assumption: features are conditionally independent given the class:<br>P(x\u2081, x\u2082, x\u2083 | spam) = P(x\u2081|spam) \u00b7 P(x\u2082|spam) \u00b7 P(x\u2083|spam)<br><br>This is almost certainly wrong (words are correlated!), but it works surprisingly well in practice because:<br>1. We only need the <em>ranking</em> of classes, not exact probabilities<br>2. The independence errors tend to cancel out<br>3. The model is very fast to train and hard to overfit</div></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> The Naive Bayes classifier is called "naive" precisely because it assumes features are conditionally independent given the class label. Despite this unrealistic assumption, Naive Bayes is surprisingly effective for text classification and remains a strong baseline in NLP. Understanding why independence matters (and when it can be safely assumed) is key to understanding many ML models.</div>'

/* ============================================================
   SECTION 7: Random Variables
   ============================================================ */
+ '<h2 class="l-title">7. Random Variables</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> When you roll a die, the outcome (1-6) is random. A <em>random variable</em> assigns a number to each outcome. You could define X = "the number shown" (so X \u2208 {1,...,6}) or Y = "is the result even?" (Y \u2208 {0,1}). Random variables let us do math with random outcomes.</div>'

+ '<p class="l-text">A <strong>random variable</strong> is a function that maps each outcome in the sample space to a number. This bridge from "outcomes" to "numbers" lets us use all the tools of calculus and algebra on random phenomena.</p>'

+ '<div class="calc-formula"><div class="formula-label">RANDOM VARIABLE</div><div class="formula-main">$$X: S \\to \\mathbb{R}$$</div><div class="formula-sub">X is a function from the sample space S to the real numbers. Each outcome \u03c9 maps to a number X(\u03c9).</div></div>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">DISCRETE R.V.</div><div class="compare-item">\u2022 Takes <strong>countable</strong> values</div><div class="compare-item">\u2022 Examples: dice (1-6), word count, class label</div><div class="compare-item">\u2022 Described by <strong>PMF</strong> (Probability Mass Function)</div><div class="compare-item">\u2022 P(X = x) gives probability of each value</div><div class="compare-item">\u2022 Sum of all P(X=x) = 1</div></div><div class="compare-col"><div class="compare-title">CONTINUOUS R.V.</div><div class="compare-item">\u2022 Takes <strong>uncountable</strong> values (any real number)</div><div class="compare-item">\u2022 Examples: temperature, weight, embedding value</div><div class="compare-item">\u2022 Described by <strong>PDF</strong> (Probability Density Function)</div><div class="compare-item">\u2022 P(X = x) = 0 for any single value!</div><div class="compare-item">\u2022 Integral of PDF over all x = 1</div></div></div>'

+ '<div class="calc-formula"><div class="formula-label">PMF (DISCRETE)</div><div class="formula-main">$$p(x) = P(X = x), \\quad \\sum_{\\text{all } x} p(x) = 1$$</div><div class="formula-sub">PMF tells the probability of each specific value. All probabilities must sum to 1.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">PDF (CONTINUOUS)</div><div class="formula-main">$$P(a \\leq X \\leq b) = \\int_a^b f(x)\\,dx, \\quad \\int_{-\\infty}^{\\infty} f(x)\\,dx = 1$$</div><div class="formula-sub">PDF gives density, not probability. To get probability, integrate over an interval. The total area under the curve equals 1.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">CDF (CUMULATIVE DISTRIBUTION)</div><div class="formula-main">$$F(x) = P(X \\leq x)$$</div><div class="formula-sub">CDF gives the probability that X is less than or equal to x. It is non-decreasing, starts at 0 and ends at 1.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Mass Function</div><div class="card-body">For discrete variables. P(X=3) = 1/6 for a fair die. Visualized as bars. Each bar height = probability.</div></div>'
+ '<div class="calc-card"><div class="card-title">Density Function</div><div class="card-body">For continuous variables. f(x) can be >1! Only areas under the curve are probabilities. The bell curve is a PDF.</div></div>'
+ '<div class="calc-card"><div class="card-title">Cumulative Function</div><div class="card-body">Works for both types. F(x) = P(X \u2264 x). Always goes from 0 to 1. CDF is the running total of the PMF/PDF.</div></div>'
+ '</div>'

/* --- Plotly: PMF Bar Chart (fair die) --- */
+ '<div id="plot-pmf-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var xv=[1,2,3,4,5,6];var yv=[1/6,1/6,1/6,1/6,1/6,1/6];'
+ 'var t1={x:xv,y:yv,type:"bar",name:"P(X = x)",marker:{color:["#c8a96e","#4ecdc4","#a78bfa","#f87171","#34d399","#fb923c"]},width:0.5};'
+ 'var layout={title:{text:"PMF of a Fair Die",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (outcome)",dtick:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"P(X = x)",range:[0,0.25]},margin:{t:50,r:30,b:50,l:60},showlegend:false};'
+ 'Plotly.newPlot("plot-pmf-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The PMF of a fair die. Each outcome (1 through 6) has equal probability 1/6 \u2248 0.167. The bar heights represent the probability of each specific outcome. All bars sum to 1.</div></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> In classification, the model output is a PMF over classes: P(class=cat)=0.8, P(class=dog)=0.15, P(class=bird)=0.05. In language modeling, it is a PMF over the entire vocabulary at each position. The concept of random variables bridges the gap between abstract probability and practical ML computation.</div>'

/* ============================================================
   SECTION 8: Expected Value & Variance
   ============================================================ */
+ '<h2 class="l-title">8. Expected Value & Variance</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> If you play a game where you win $10 half the time and lose $6 half the time, your <em>expected value</em> per game is 0.5\u00d710 + 0.5\u00d7(-6) = $2. You won\'t win exactly $2 any single game, but on average over many games, you gain $2 per game. This is the "center of mass" of the distribution.</div>'

+ '<p class="l-text">The <strong>expected value</strong> (mean) tells us the "average" outcome. The <strong>variance</strong> tells us how spread out the outcomes are around that average. Together, they summarize the most important properties of a distribution.</p>'

+ '<div class="calc-formula"><div class="formula-label">EXPECTED VALUE (DISCRETE)</div><div class="formula-main">$$E[X] = \\sum_x x \\cdot P(X = x)$$</div><div class="formula-sub">Weighted average of all possible values, weighted by their probabilities.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">EXPECTED VALUE (CONTINUOUS)</div><div class="formula-main">$$E[X] = \\int_{-\\infty}^{\\infty} x \\cdot f(x)\\,dx$$</div><div class="formula-sub">Same idea but with integration instead of summation. The integral of x times the density.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Expected Value</div><div class="card-body">Also called the <strong>mean</strong> or \u03bc. The center of mass of the distribution. Not necessarily a value X can take!</div></div>'
+ '<div class="calc-card"><div class="card-title">Mu (Mean)</div><div class="card-body">Common notation for E[X]. For a fair die: \u03bc = (1+2+3+4+5+6)/6 = 3.5. You never roll 3.5, but it is the average.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Key properties of expectation (linearity):</strong></p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">E[aX + b] = aE[X] + b</div><div class="step-detail">Constants factor out. Shifting by b shifts the mean by b. Scaling by a scales the mean by a.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">E[X + Y] = E[X] + E[Y]</div><div class="step-detail">Expectation of a sum = sum of expectations. This works even if X and Y are dependent! This is linearity of expectation.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">E[XY] = E[X]\u00b7E[Y] (if independent)</div><div class="step-detail">Product rule only works for independent variables. For dependent variables, E[XY] involves the covariance.</div></div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">VARIANCE</div><div class="formula-main">$$\\text{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2$$</div><div class="formula-sub">Variance measures the average squared deviation from the mean. The second form is the computational shortcut.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">STANDARD DEVIATION</div><div class="formula-main">$$\\sigma = \\sqrt{\\text{Var}(X)}$$</div><div class="formula-sub">Square root of variance. Same units as X, so it is more interpretable than variance.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Variance</div><div class="card-body">How spread out the distribution is. High variance = wide spread. Low variance = concentrated around mean. Units are squared.</div></div>'
+ '<div class="calc-card"><div class="card-title">Std Deviation</div><div class="card-body">Square root of variance. In original units. For a normal distribution, ~68% of data falls within \u03bc \u00b1 \u03c3.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Fair die:</strong> X = outcome of rolling a die.<br><br>E[X] = (1+2+3+4+5+6)/6 = 21/6 = <strong>3.5</strong><br><br>E[X\u00b2] = (1+4+9+16+25+36)/6 = 91/6 \u2248 15.167<br><br>Var(X) = E[X\u00b2] - (E[X])\u00b2 = 91/6 - (7/2)\u00b2 = 91/6 - 49/4 = 35/12 \u2248 <strong>2.917</strong><br><br>\u03c3 = \u221a(35/12) \u2248 <strong>1.708</strong></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Fair die: outcomes and probabilities</span>\noutcomes = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>, <span class="num">6</span>])\nprobs = np.<span class="fn">array</span>([<span class="num">1/6</span>] * <span class="num">6</span>)\n\n<span class="cm"># Expected value: E[X] = sum(x * p(x))</span>\nmean = np.<span class="fn">sum</span>(outcomes * probs)\n<span class="fn">print</span>(<span class="str">f"E[X] = {mean}"</span>)         <span class="cm"># 3.5</span>\n\n<span class="cm"># Variance: E[X^2] - (E[X])^2</span>\ne_x2 = np.<span class="fn">sum</span>(outcomes**<span class="num">2</span> * probs)\nvar = e_x2 - mean**<span class="num">2</span>\n<span class="fn">print</span>(<span class="str">f"Var(X) = {var:.4f}"</span>)     <span class="cm"># 2.9167</span>\n<span class="fn">print</span>(<span class="str">f"Std(X) = {np.sqrt(var):.4f}"</span>)  <span class="cm"># 1.7078</span>\n\n<span class="cm"># Verify with NumPy\'s built-in</span>\nsamples = np.random.<span class="fn">choice</span>(outcomes, size=<span class="num">100000</span>)\n<span class="fn">print</span>(<span class="str">f"Sample mean: {samples.mean():.3f}"</span>)\n<span class="fn">print</span>(<span class="str">f"Sample std:  {samples.std():.3f}"</span>)</code></pre></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> The loss function in ML is an expected value: L = E[loss(prediction, true label)]. We approximate this expectation with a sum over the training batch (minibatch gradient descent). Variance plays a critical role too: high-variance gradients make training unstable, which is why techniques like batch normalization and gradient clipping exist.</div>'

/* ============================================================
   SECTION 9: Common Distributions
   ============================================================ */
+ '<h2 class="l-title">9. Common Distributions</h2>'

+ '<div class="calc-highlight"><strong>Key insight:</strong> Instead of specifying individual probabilities for every possible outcome, we use named distributions with a few parameters. Knowing that data follows a "Gaussian with \u03bc=0, \u03c3=1" immediately tells you everything about the distribution. These named distributions are the building blocks of all probabilistic ML models.</div>'

+ '<p class="l-text">Here are the distributions you will encounter most in ML:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Bernoulli(p)</div><div class="card-body">Single binary trial. X \u2208 {0,1}. P(X=1) = p, P(X=0) = 1-p. <strong>Use case:</strong> coin flip, binary classification (spam/not spam). Mean = p, Var = p(1-p).</div></div>'
+ '<div class="calc-card"><div class="card-title">Binomial(n,p)</div><div class="card-body">Number of successes in n independent Bernoulli trials. X \u2208 {0,1,...,n}. <strong>Use case:</strong> "out of 100 emails, how many are spam?" Mean = np, Var = np(1-p).</div></div>'
+ '<div class="calc-card"><div class="card-title">Uniform(a,b)</div><div class="card-body">All values in [a,b] equally likely. f(x) = 1/(b-a). <strong>Use case:</strong> random initialization, dropout masks. Mean = (a+b)/2.</div></div>'
+ '<div class="calc-card"><div class="card-title">Categorical(p\u2081,...,p\u2096)</div><div class="card-body">Generalization of Bernoulli to K classes. X \u2208 {1,...,K}. <strong>Use case:</strong> softmax output, next-word prediction. Sums to 1.</div></div>'
+ '<div class="calc-card"><div class="card-title">Gaussian(\u03bc,\u03c3\u00b2)</div><div class="card-body">The bell curve! Defined by mean \u03bc and variance \u03c3\u00b2. <strong>Use case:</strong> weight initialization, noise modeling, latent spaces (VAE). The most important continuous distribution.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">GAUSSIAN (NORMAL) PDF</div><div class="formula-main">$$f(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$</div><div class="formula-sub">The famous bell curve. Parameterized by mean \u03bc (center) and variance \u03c3\u00b2 (width). The standard normal has \u03bc=0, \u03c3=1.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">BINOMIAL PMF</div><div class="formula-main">$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$$</div><div class="formula-sub">Probability of exactly k successes in n trials, each with success probability p.</div></div>'

/* --- Plotly: Gaussian Bell Curves --- */
+ '<div id="plot-gauss-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'function gauss(x,mu,sig){return(1/(sig*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*Math.pow((x-mu)/sig,2));}'
+ 'var xv=[];for(var i=-50;i<=50;i++)xv.push(i/10);'
+ 'var y1=xv.map(function(x){return gauss(x,0,1);});'
+ 'var y2=xv.map(function(x){return gauss(x,0,2);});'
+ 'var y3=xv.map(function(x){return gauss(x,2,0.7);});'
+ 'var t1={x:xv,y:y1,mode:"lines",name:"\u03bc=0, \u03c3=1 (standard)",line:{color:"#c8a96e",width:2.5}};'
+ 'var t2={x:xv,y:y2,mode:"lines",name:"\u03bc=0, \u03c3=2 (wider)",line:{color:"#4ecdc4",width:2.5}};'
+ 'var t3={x:xv,y:y3,mode:"lines",name:"\u03bc=2, \u03c3=0.7 (shifted, narrow)",line:{color:"#a78bfa",width:2.5}};'
+ 'var layout={title:{text:"Gaussian (Normal) Distributions",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-5,5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[0,0.65]},margin:{t:50,r:30,b:50,l:60},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-gauss-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Three Gaussian distributions with different parameters. The gold curve is the standard normal (mean=0, std=1). The teal curve has larger \u03c3, so it is wider and shorter. The purple curve is shifted right (\u03bc=2) and narrower (\u03c3=0.7). Changing \u03bc shifts the curve; changing \u03c3 stretches or compresses it.</div></div>'

/* --- Plotly: CDF of Standard Normal --- */
+ '<div id="plot-cdf-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'function normalCDF(x){var t=1/(1+0.2316419*Math.abs(x));var d=0.3989422802*Math.exp(-x*x/2);var p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.8212560+t*1.3302744))));return x>0?1-p:p;}'
+ 'var xv=[];var yv=[];for(var i=-40;i<=40;i++){var x=i/10;xv.push(x);yv.push(normalCDF(x));}'
+ 'var t1={x:xv,y:yv,mode:"lines",name:"CDF: \u03a6(x) = P(X \u2264 x)",line:{color:"#f87171",width:2.5}};'
+ 'var ann=[{x:0,y:0.5,text:"P(X \u2264 0) = 0.5",showarrow:true,arrowhead:2,ax:60,ay:-30,font:{color:"#f87171",size:12}},{x:1.96,y:0.975,text:"P(X \u2264 1.96) = 0.975",showarrow:true,arrowhead:2,ax:-10,ay:-30,font:{color:"#ebe6dc",size:11}}];'
+ 'var layout={title:{text:"CDF of Standard Normal Distribution",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-4,4]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"\u03a6(x) = P(X \u2264 x)",range:[0,1.05]},annotations:ann,margin:{t:50,r:30,b:50,l:60},showlegend:false};'
+ 'Plotly.newPlot("plot-cdf-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},250)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The CDF of the standard normal distribution. It shows P(X \u2264 x) for each x. At x=0, the CDF is 0.5 (50% of the probability is below the mean). At x=1.96, the CDF is 0.975, meaning 97.5% of values fall below 1.96 standard deviations above the mean. This is where the "95% confidence interval" comes from (\u00b11.96\u03c3).</div></div>'

/* --- Plotly: Binomial PMF --- */
+ '<div id="plot-binom-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'function binomCoeff(n,k){if(k<0||k>n)return 0;if(k===0||k===n)return 1;var c=1;for(var i=0;i<k;i++){c=c*(n-i)/(i+1);}return c;}'
+ 'function binomPMF(k,n,p){return binomCoeff(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}'
+ 'var xv=[];var y1=[];var y2=[];for(var k=0;k<=20;k++){xv.push(k);y1.push(binomPMF(k,20,0.5));y2.push(binomPMF(k,20,0.3));}'
+ 'var t1={x:xv,y:y1,type:"bar",name:"Bin(20, 0.5)",marker:{color:"#c8a96e",opacity:0.7},width:0.35,offset:-0.2};'
+ 'var t2={x:xv,y:y2,type:"bar",name:"Bin(20, 0.3)",marker:{color:"#4ecdc4",opacity:0.7},width:0.35,offset:0.15};'
+ 'var layout={title:{text:"Binomial PMF: n=20 trials",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"k (number of successes)",dtick:2},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"P(X = k)"},margin:{t:50,r:30,b:50,l:60},showlegend:true,legend:{font:{color:"#ebe6dc"}},barmode:"group"};'
+ 'Plotly.newPlot("plot-binom-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},300)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Two Binomial distributions with n=20 trials. Gold bars show p=0.5 (fair coin, centered at 10). Teal bars show p=0.3 (biased coin, centered at 6). Higher p shifts the distribution right; the binomial approaches a Gaussian for large n (Central Limit Theorem).</div></div>'

+ '<div class="l-warn"><strong>Important:</strong> The Gaussian distribution appears everywhere in ML: weight initialization (Xavier, He), noise in generative models, latent spaces in VAEs, the Central Limit Theorem (sample means are approximately Gaussian), and regularization (L2 penalty = Gaussian prior on weights).</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\n<span class="cm"># Bernoulli: single coin flip</span>\nbern = stats.<span class="fn">bernoulli</span>(p=<span class="num">0.7</span>)\n<span class="fn">print</span>(<span class="str">"Bernoulli samples:"</span>, bern.<span class="fn">rvs</span>(size=<span class="num">10</span>))\n\n<span class="cm"># Binomial: 20 trials, p=0.3</span>\nbinom = stats.<span class="fn">binom</span>(n=<span class="num">20</span>, p=<span class="num">0.3</span>)\n<span class="fn">print</span>(<span class="str">"P(X=6)  ="</span>, binom.<span class="fn">pmf</span>(<span class="num">6</span>))   <span class="cm"># PMF at k=6</span>\n<span class="fn">print</span>(<span class="str">"P(X<=6) ="</span>, binom.<span class="fn">cdf</span>(<span class="num">6</span>))   <span class="cm"># CDF at k=6</span>\n<span class="fn">print</span>(<span class="str">"Mean ="</span>, binom.<span class="fn">mean</span>())       <span class="cm"># np = 6.0</span>\n\n<span class="cm"># Gaussian: mu=0, sigma=1</span>\nnorm = stats.<span class="fn">norm</span>(loc=<span class="num">0</span>, scale=<span class="num">1</span>)\n<span class="fn">print</span>(<span class="str">"P(X<=1.96) ="</span>, norm.<span class="fn">cdf</span>(<span class="num">1.96</span>))  <span class="cm"># 0.975</span>\n<span class="fn">print</span>(<span class="str">"P(-1.96<=X<=1.96) ="</span>, norm.<span class="fn">cdf</span>(<span class="num">1.96</span>) - norm.<span class="fn">cdf</span>(-<span class="num">1.96</span>))  <span class="cm"># 0.95</span>\n\n<span class="cm"># Categorical: softmax output (next word prediction)</span>\nlogits = np.<span class="fn">array</span>([<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.5</span>, <span class="num">0.1</span>])\nprobs = np.<span class="fn">exp</span>(logits) / np.<span class="fn">sum</span>(np.<span class="fn">exp</span>(logits))  <span class="cm"># softmax</span>\n<span class="fn">print</span>(<span class="str">"Categorical probs:"</span>, probs.round(<span class="num">3</span>))\n<span class="fn">print</span>(<span class="str">"Sum ="</span>, probs.<span class="fn">sum</span>())  <span class="cm"># 1.0</span></code></pre></div>'

/* ============================================================
   SECTION 10: Summary & Next Steps
   ============================================================ */
+ '<h2 class="l-title">10. Summary & Next Steps</h2>'

+ '<p class="l-text">This lesson covered the fundamental probability concepts that underpin all of machine learning. Here is your complete concept map:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Sample Space</div><div class="card-body">Set of all possible outcomes. In NLP, the vocabulary is the sample space for next-word prediction.</div><div class="card-formula">S = {all outcomes}</div></div>'
+ '<div class="calc-card"><div class="card-title">Axioms</div><div class="card-body">Non-negativity, normalization (sum to 1), additivity. These three rules generate all of probability theory.</div><div class="card-formula">0\u2264P(A)\u22641, P(S)=1</div></div>'
+ '<div class="calc-card"><div class="card-title">Conditional</div><div class="card-body">P(A|B) = P(A\u2229B)/P(B). Updates belief given evidence. The foundation of language models and classification.</div><div class="card-formula">P(A|B) = P(A\u2229B)/P(B)</div></div>'
+ '<div class="calc-card"><div class="card-title">Bayes\' Theorem</div><div class="card-body">Posterior = Likelihood \u00d7 Prior / Evidence. Inverts conditionals. Powers Naive Bayes, Bayesian ML.</div><div class="card-formula">P(A|B) = P(B|A)P(A)/P(B)</div></div>'
+ '<div class="calc-card"><div class="card-title">Independence</div><div class="card-body">P(A\u2229B) = P(A)P(B). Simplifies computation. Naive Bayes assumes conditional independence.</div><div class="card-formula">A \u22a5 B \u21d2 P(A\u2229B)=P(A)P(B)</div></div>'
+ '<div class="calc-card"><div class="card-title">Random Variables</div><div class="card-body">Maps outcomes to numbers. Discrete (PMF) vs continuous (PDF). CDF accumulates probability.</div><div class="card-formula">X: S \u2192 \u211d</div></div>'
+ '<div class="calc-card"><div class="card-title">Expectation</div><div class="card-body">Weighted average. The loss function is an expectation. Linear: E[X+Y] = E[X]+E[Y].</div><div class="card-formula">E[X] = \u03a3 x\u00b7P(x)</div></div>'
+ '<div class="calc-card"><div class="card-title">Variance</div><div class="card-body">Spread around the mean. High variance = noisy gradients. Var(X) = E[X\u00b2] - (E[X])\u00b2.</div><div class="card-formula">Var(X) = E[(X-\u03bc)\u00b2]</div></div>'
+ '<div class="calc-card"><div class="card-title">Distributions</div><div class="card-body">Named families: Bernoulli, Binomial, Gaussian, Categorical, Uniform. Building blocks of all probabilistic models.</div><div class="card-formula">N(\u03bc, \u03c3\u00b2), Bin(n,p), ...</div></div>'
+ '</div>'

+ '<div class="l-warn"><strong>Next Lesson:</strong> In Lesson 2, we move to <strong>Statistics Fundamentals</strong> \u2014 estimation, hypothesis testing, maximum likelihood estimation (MLE), and the connection between statistics and ML training. MLE is literally what training a neural network does: finding parameters that maximize the probability of the observed data.</div>'

/* ============================================================
   TURKISH VERSION
   ============================================================ */
,tr: '<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div><p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p><ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none"><li><a href="/tutorials/matematik/40" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Fonksiyonlar</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L40)</span></li><li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrisler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L72)</span></li><li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Olasılık Temelleri</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L94)</span></li><li><a href="/tutorials/matematik/101" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Beklenen Değer</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L101)</span></li></ul></div><p class="l-text"><strong>Olas\u0131l\u0131k, belirsizli\u011fin dilidir.</strong> Bir makine \u00f6\u011frenmesi modelinin yapt\u0131\u011f\u0131 her tahmin belirsizlik i\u00e7erir ve olas\u0131l\u0131k bize bu belirsizlik hakk\u0131nda kat\u0131 matematiksel ak\u0131l y\u00fcr\u00fctme ara\u00e7lar\u0131 verir. Spam filtrelerinden dil modellerine, t\u0131bbi te\u015fhisten konu\u015fma tan\u0131maya kadar \u2014 olas\u0131l\u0131k t\u00fcm ML ve YZ\'nin \u00fczerine in\u015fa edildi\u011fi temeldir.</p>'

+ '<p class="l-text">Dilin kendisi do\u011fas\u0131 gere\u011fi olas\u0131l\u0131ksald\u0131r: bir c\u00fcmlede sonraki kelime ba\u011flama, belirsizli\u011fe ve niyete ba\u011fl\u0131d\u0131r. GPT metin \u00fcretti\u011finde, kelimelerin olas\u0131l\u0131k da\u011f\u0131l\u0131m\u0131ndan \u00f6rnekleme yapmaktad\u0131r. Bu ders olas\u0131l\u0131k sezginizi s\u0131f\u0131rdan olu\u015fturur \u2014 her sembol a\u00e7\u0131klan\u0131r, her kavram ML\'ye ba\u011flan\u0131r.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">\ud83d\udccd BU DERSTE \u00d6\u011eRENECEKS\u0130N</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>T\u00fcm olas\u0131l\u0131\u011f\u0131n \u00fczerine kuruldu\u011fu \u00fc\u00e7 Kolmogorov aksiyomunu ifade etmeyi</li>'
+ '<li>Bir kontenjans tablosundan ortak, ko\u015fullu ve marjinal olas\u0131l\u0131klar\u0131 hesaplamay\u0131</li>'
+ '<li>Bayes teoremini ger\u00e7ek t\u0131bbi test problemine uygulay\u0131p \u00f6nseli a\u00e7\u0131klamay\u0131</li>'
+ '<li>Kesikli ve s\u00fcrekli rastgele de\u011fi\u015fkenleri PMF/PDF\\\'leriyle ay\u0131rt etmeyi</li>'
+ '<li>ML verisinde Bernoulli, Binom, Gauss ve Poisson da\u011f\u0131l\u0131mlar\u0131n\u0131 tan\u0131may\u0131</li>'
+ '<li>Maksimum olabilirlik tahminini bir modelin e\u011fitim kay\u0131p fonksiyonuna ba\u011flamay\u0131</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   BOLUM 1: Neden Olasilik?
   ============================================================ */
+ '<h2 class="l-title">1. Neden Olas\u0131l\u0131k?</h2>'

+ '<div class="calc-highlight"><strong>G\u00fcnl\u00fck hayat benzetmesi:</strong> Hava durumunu kontrol edip "%70 ya\u011fmur olas\u0131l\u0131\u011f\u0131" g\u00f6rd\u00fc\u011f\u00fcn\u00fczde, bu olas\u0131l\u0131\u011f\u0131n eylemidir. Tahminci "ya\u011facak" veya "ya\u011fmayacak" demez \u2014 <em>belirsizli\u011fini</em> say\u0131salla\u015ft\u0131r\u0131r. Makine \u00f6\u011frenmesi modelleri de tam olarak bunu yapar.</div>'

+ '<p class="l-text">ML neden olas\u0131l\u0131\u011fa ihtiya\u00e7 duyar? \u00c7\u00fcnk\u00fc ger\u00e7ek d\u00fcnya g\u00fcr\u00fclt\u00fcl\u00fc, belirsiz ve eksik bilgiyle doludur:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">G\u00fcr\u00fclt\u00fcl\u00fc Veri</div><div class="card-body">Sens\u00f6rlerde hata, etiketlerde yanl\u0131\u015fl\u0131k olur. Olas\u0131l\u0131k <strong>g\u00fcr\u00fclt\u00fcy\u00fc modelleyerek</strong> iyi tahminler yapmam\u0131z\u0131 sa\u011flar.</div></div>'
+ '<div class="calc-card"><div class="card-title">Belirsizlik</div><div class="card-body">"Banka" = nehir kenar\u0131 m\u0131 finansal kurum mu? NLP modelleri <strong>ba\u011flamdan</strong> en olas\u0131 anlam\u0131 se\u00e7mek i\u00e7in olas\u0131l\u0131k kullan\u0131r.</div></div>'
+ '<div class="calc-card"><div class="card-title">K\u0131smi Bilgi</div><div class="card-body">Hi\u00e7bir zaman t\u00fcm veriye sahip olmay\u0131z. Olas\u0131l\u0131k, bildiklerimize g\u00f6re <strong>en iyi \u00e7\u0131kar\u0131m\u0131</strong> yapmam\u0131z\u0131 sa\u011flar.</div></div>'
+ '<div class="calc-card"><div class="card-title">Genelleme</div><div class="card-body">1 milyon c\u00fcmle \u00fczerinde e\u011fitilen model hi\u00e7 g\u00f6rmedi\u011fi c\u00fcmlelerde \u00e7al\u0131\u015fmal\u0131. Olas\u0131l\u0131k teorisi genellemenin <strong>ne zaman ve neden</strong> m\u00fcmk\u00fcn oldu\u011funu s\u00f6yler.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>NLP\'de olas\u0131l\u0131k \u00f6zellikle:</strong></p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Dil Modelleri</div><div class="step-detail">GPT, P(sonraki kelime | \u00f6nceki kelimeler) hesaplar. T\u00fcm \u00fcretim s\u00fcreci ko\u015fullu olas\u0131l\u0131k da\u011f\u0131l\u0131mlar\u0131ndan tekrarl\u0131 \u00f6rneklemedir.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Metin S\u0131n\u0131fland\u0131rma</div><div class="step-detail">Spam filtreleri Bayes teoremini kullanarak P(spam | e-posta metni) hesaplar.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Makine \u00c7evirisi</div><div class="step-detail">\u00c7eviri modelleri P(hedef c\u00fcmle | kaynak c\u00fcmle) hesaplar ve en olas\u0131 \u00e7eviriyi bulur.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Bilgi Teorisi</div><div class="step-detail">\u00c7apraz entropi kayb\u0131 (s\u0131n\u0131fland\u0131rma kayb\u0131) do\u011frudan olas\u0131l\u0131k ve bilgi teorisinden t\u00fcretilir.</div></div></div>'
+ '</div>'

+ '<div class="l-note"><strong>ML Ba\u011flant\u0131s\u0131:</strong> Her s\u0131n\u0131fland\u0131rma sinir a\u011f\u0131n\u0131n sonundaki softmax fonksiyonu ham skorlar\u0131 olas\u0131l\u0131k da\u011f\u0131l\u0131m\u0131na d\u00f6n\u00fc\u015ft\u00fcr\u00fcr. softmax(z) = [0.7, 0.2, 0.1] g\u00f6rd\u00fc\u011f\u00fcn\u00fczde, model s\u0131n\u0131f 1\'e %70, s\u0131n\u0131f 2\'ye %20, s\u0131n\u0131f 3\'e %10 olas\u0131l\u0131k atamaktad\u0131r.</div>'

/* ============================================================
   BOLUM 2: Orneklem Uzayi & Olaylar
   ============================================================ */
+ '<h2 class="l-title">2. \u00d6rneklem Uzay\u0131 & Olaylar</h2>'

+ '<div class="calc-highlight"><strong>G\u00fcnl\u00fck hayat benzetmesi:</strong> Bir zar att\u0131\u011f\u0131n\u0131zda olas\u0131 sonu\u00e7lar {1, 2, 3, 4, 5, 6}\'d\u0131r. T\u00fcm olas\u0131 sonu\u00e7lar\u0131n k\u00fcmesi <em>\u00f6rneklem uzay\u0131</em>d\u0131r. Bir "olay" ise "\u00e7ift say\u0131 att\u0131m m\u0131?" gibi bir soru olup {2, 4, 6} alt k\u00fcmesine kar\u015f\u0131l\u0131k gelir.</div>'

+ '<p class="l-text">Olas\u0131l\u0131klar atamadan \u00f6nce, hangi sonu\u00e7lar\u0131n m\u00fcmk\u00fcn oldu\u011funu ve hangi sorular\u0131 sorabiliece\u011fimizi tam olarak tan\u0131mlamam\u0131z gerekir:</p>'

+ '<div class="calc-formula"><div class="formula-label">TEMEL TANIMLAR</div><div class="formula-main">$$\\text{Experiment} \\to \\text{Sample Space } S \\to \\text{Events } A, B \\subseteq S$$</div><div class="formula-sub">Bir deney sonu\u00e7lar \u00fcretir. T\u00fcm sonu\u00e7lar\u0131n k\u00fcmesi S\'dir. S\'nin herhangi bir alt k\u00fcmesi bir olayd\u0131r.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">\u00d6rneklem Uzay\u0131</div><div class="card-body">Bir deneyin <strong>t\u00fcm olas\u0131 sonu\u00e7lar\u0131n\u0131n</strong> k\u00fcmesi. \u03a9 (omega) olarak da yaz\u0131l\u0131r. Kapsaml\u0131 olmal\u0131 \u2014 hi\u00e7bir \u015fey d\u0131\u015far\u0131da kalmaz.</div></div>'
+ '<div class="calc-card"><div class="card-title">Sonu\u00e7</div><div class="card-body">Tek bir sonu\u00e7. Yaz\u0131-tura i\u00e7in: \u03c9 \u2208 {Y, T}. NLP\'de: s\u00f6zl\u00fckten tek bir kelime bir sonu\u00e7tur.</div></div>'
+ '<div class="calc-card"><div class="card-title">Olay</div><div class="card-body">S\'nin herhangi bir <strong>alt k\u00fcmesi</strong>. "\u00c7ift atmak" = {2,4,6}. "Model pozitif tahmin etti" = t\u00fcm tahminlerin alt k\u00fcmesi.</div></div>'
+ '<div class="calc-card"><div class="card-title">Bo\u015f Olay</div><div class="card-body">\u0130mkans\u0131z olay \u2014 hi\u00e7bir sonu\u00e7 yok. P(\u2205) = 0. \u00d6rnek: standart zarda 7 atmak.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Olaylar \u00fczerinde k\u00fcme i\u015flemleri:</strong></p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">B\u0130RLE\u015e\u0130M: A \u222a B</div><div class="compare-item">\u2022 "A <strong>veya</strong> B (veya ikisi)"</div><div class="compare-item">\u2022 En az birinde olan t\u00fcm sonu\u00e7lar</div><div class="compare-item">\u2022 \u00d6rnek: \u00e7ift VEYA >4 = {2,4,5,6}</div></div><div class="compare-col"><div class="compare-title">KES\u0130\u015e\u0130M: A \u2229 B</div><div class="compare-item">\u2022 "A <strong>ve</strong> B (ikisi de)"</div><div class="compare-item">\u2022 Sadece her ikisinde de olan sonu\u00e7lar</div><div class="compare-item">\u2022 \u00d6rnek: \u00e7ift VE >4 = {6}</div></div></div>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">T\u00dcMLEYEN: A\u1d9c</div><div class="compare-item">\u2022 "A <strong>de\u011fil</strong>"</div><div class="compare-item">\u2022 A\'da OLMAYAN t\u00fcm sonu\u00e7lar</div><div class="compare-item">\u2022 \u00d6rnek: \u00e7ift de\u011fil = {1,3,5}</div></div><div class="compare-col"><div class="compare-title">FARK: A \\ B</div><div class="compare-item">\u2022 "A ama B <strong>de\u011fil</strong>"</div><div class="compare-item">\u2022 A\'da olup B\'de olmayan sonu\u00e7lar</div><div class="compare-item">\u2022 \u00d6rnek: \u00e7ift ama >4 de\u011fil = {2,4}</div></div></div>'

+ '<div class="calc-example"><div class="example-label">\u00c7ALI\u015eILMI\u015e \u00d6RNEK</div><div class="example-body"><strong>NLP \u00d6rneklem Uzay\u0131:</strong> Basit bir s\u00f6zl\u00fck V = {"the", "cat", "sat", "on", "mat"} d\u00fc\u015f\u00fcn\u00fcn.<br><br>\u00d6rneklem uzay\u0131: S = V = {"the", "cat", "sat", "on", "mat"}<br><br>Olay A = "\u00fcns\u00fczle ba\u015flayan kelime" = {"cat", "sat", "mat"}<br>Olay B = "3 harfli kelime" = {"the", "cat", "sat", "mat"}<br><br>A \u2229 B = {"cat", "sat", "mat"} (\u00fcns\u00fcz ba\u015flang\u0131\u00e7 VE 3 harf)<br>A \u222a B = {"the", "cat", "sat", "mat"} (\u00fcns\u00fcz ba\u015flang\u0131\u00e7 VEYA 3 harf)<br>A\u1d9c = {"the", "on"} (\u00fcns\u00fczle BA\u015eLAMIYOR)</div></div>'

+ '<div class="think-box"><div class="think-label">D\u00dc\u015e\u00dcN\u00dcN</div><div class="think-body">Dil modellemesinde \u00f6rneklem uzay\u0131 t\u00fcm s\u00f6zl\u00fckt\u00fcr. GPT-4\'un yakla\u015f\u0131k 100.000 token\'l\u0131k s\u00f6zl\u00fc\u011f\u00fc var. Bir sonraki token\'i \u00fcretirken, 100.000 sonu\u00e7tan her birine olas\u0131l\u0131k atar!</div></div>'

/* ============================================================
   BOLUM 3: Olasilik Aksiyomlari
   ============================================================ */
+ '<h2 class="l-title">3. Olas\u0131l\u0131k Aksiyomlar\u0131</h2>'

+ '<div class="calc-highlight"><strong>Temel fikir:</strong> Olas\u0131l\u0131k sadece "i\u00e7 his" de\u011fildir. \u00dc\u00e7 basit aksiyom (kural) \u00fczerine in\u015fa edilmi\u015f bir <em>matematiksel sistemdir</em>. Her olas\u0131l\u0131k form\u00fcl\u00fc ve ML algoritmas\u0131 bu \u00fc\u00e7 aksiyomdan t\u00fcrer. Andrey Kolmogorov taraf\u0131ndan 1933\'te formalize edilmi\u015ftir.</div>'

+ '<p class="l-text">Bir <strong>olas\u0131l\u0131k fonksiyonu</strong> P, her olaya bir say\u0131 atar ve \u00fc\u00e7 aksiyomu sa\u011flar:</p>'

+ '<div class="calc-formula"><div class="formula-label">AKS\u0130YOM 1: NEGAT\u0130F OLMAMA</div><div class="formula-main">$$P(A) \\geq 0 \\quad \\text{for every event } A$$</div><div class="formula-sub">Olas\u0131l\u0131klar asla negatif de\u011fildir. %-30 \u015fans diye bir \u015fey yoktur.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">AKS\u0130YOM 2: NORMAL\u0130ZASYON</div><div class="formula-main">$$P(S) = 1$$</div><div class="formula-sub">B\u0130R \u015eEY\u0130N olma olas\u0131l\u0131\u011f\u0131 1\'dir (%100). \u00d6rneklem uzay\u0131 t\u00fcm olas\u0131l\u0131klar\u0131 kapsar.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">AKS\u0130YOM 3: TOPLAMSALLIK</div><div class="formula-main">$$\\text{If } A \\cap B = \\emptyset, \\text{ then } P(A \\cup B) = P(A) + P(B)$$</div><div class="formula-sub">Birbirini d\u0131\u015flayan olaylar i\u00e7in (kesi\u015fmeyen), olas\u0131l\u0131klar toplan\u0131r.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Negatif Olmama</div><div class="card-body">Her olas\u0131l\u0131k 0 ile 1 aras\u0131ndad\u0131r. 0 = imkans\u0131z, 1 = kesin. T\u00fcm hesaplamalar\u0131m\u0131z\u0131 s\u0131n\u0131rlar.</div></div>'
+ '<div class="calc-card"><div class="card-title">Normalizasyon</div><div class="card-body">T\u00fcm sonu\u00e7lar \u00fczerindeki olas\u0131l\u0131klar 1\'e toplar. Softmax\'ta: [0.7, 0.2, 0.1] = 1.0. Softmax\'un ge\u00e7erli bir da\u011f\u0131l\u0131m \u00fcretmesinin nedeni budur.</div></div>'
+ '<div class="calc-card"><div class="card-title">Toplanabilir</div><div class="card-body">Kesi\u015fmeyen olaylar i\u00e7in toplay\u0131n. P(1 veya 2) = P(1) + P(2) = 1/6 + 1/6 = 1/3.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Bu \u00fc\u00e7 aksiyomdan \u00e7\u0131kan temel sonu\u00e7lar:</strong></p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">T\u00fcmleyen Kural\u0131</div><div class="step-detail">P(A\u1d9c) = 1 - P(A). Ya\u011fmur olas\u0131l\u0131\u011f\u0131 %30 ise, ya\u011fmur olmama olas\u0131l\u0131\u011f\u0131 %70\'tir.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">S\u0131n\u0131r</div><div class="step-detail">T\u00fcm A olaylar\u0131 i\u00e7in 0 \u2264 P(A) \u2264 1. Negatif olmama ve t\u00fcmleyen kural\u0131ndan \u00e7\u0131kar.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Kapsama-D\u0131\u015flama</div><div class="step-detail">P(A \u222a B) = P(A) + P(B) - P(A \u2229 B). Olaylar \u00f6rt\u00fc\u015ft\u00fc\u011f\u00fcnde, \u00e7ift say\u0131lan kesi\u015fimi \u00e7\u0131kar\u0131n.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Monotonluk</div><div class="step-detail">E\u011fer A \u2286 B ise P(A) \u2264 P(B). Bir alt k\u00fcme, onu i\u00e7eren k\u00fcmeden daha olas\u0131 olamaz.</div></div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">KAPSAMA-DI\u015eLAMA \u0130LKES\u0130</div><div class="formula-main">$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$</div><div class="formula-sub">HER\u0130K\u0130 olay i\u00e7in (sadece ayr\u0131k de\u011fil). \u00c7ift say\u0131m\u0131 \u00f6nlemek i\u00e7in \u00f6rt\u00fc\u015fmeyi \u00e7\u0131kar\u0131n.</div></div>'

+ '<div class="calc-example"><div class="example-label">\u00c7ALI\u015eILMI\u015e \u00d6RNEK</div><div class="example-body"><strong>Bir spam filtresindeki olas\u0131l\u0131klar:</strong><br><br>P("free" i\u00e7erir) = 0.3<br>P("win" i\u00e7erir) = 0.2<br>P(ikisini de i\u00e7erir) = 0.1<br><br>P("free" VEYA "win" i\u00e7erir) = 0.3 + 0.2 - 0.1 = <strong>0.4</strong><br>P(ikisini de i\u00e7ermez) = 1 - 0.4 = <strong>0.6</strong></div></div>'

+ '<div class="l-note"><strong>ML Ba\u011flant\u0131s\u0131:</strong> Softmax fonksiyonu \u00fc\u00e7 aksiyomu da garanti eder: \u00e7\u0131kt\u0131lar negatif de\u011fildir (\u00fcstelller her zaman pozitiftir), 1\'e toplarlar (normalizasyon), ve one-hot s\u0131n\u0131fland\u0131rmada birbirini d\u0131\u015flarlar. Softmax\'un ge\u00e7erli bir olas\u0131l\u0131k da\u011f\u0131l\u0131m\u0131 \u00fcretmesinin sebebi budur.</div>'

/* ============================================================
   BOLUM 4: Kosullu Olasilik
   ============================================================ */
+ '<h2 class="l-title">4. Ko\u015fullu Olas\u0131l\u0131k</h2>'

+ '<div class="calc-highlight"><strong>G\u00fcnl\u00fck hayat benzetmesi:</strong> Zeminin \u0131slak oldu\u011funu bilmek ya\u011fmur ya\u011f\u0131p ya\u011fmad\u0131\u011f\u0131 tahminizi de\u011fi\u015ftirir. D\u0131\u015far\u0131ya bakmadan \u00f6nce "%30 ya\u011fm\u0131\u015f olabilir" diyebilirsiniz. Islak zemini g\u00f6rd\u00fckten sonra "%80 olabilir" diye g\u00fcncellersiniz. Yeni bilgiye dayanan bu g\u00fcncelleme <em>ko\u015fullu olas\u0131l\u0131kt\u0131r</em>.</div>'

+ '<p class="l-text">Ko\u015fullu olas\u0131l\u0131k \u015fu soruyu yan\u0131tlar: <strong>"B oldu\u011fu biliniyorsa, A\'n\u0131n olas\u0131l\u0131\u011f\u0131 nedir?"</strong> Bu, ML\'deki en \u00f6nemli kavramd\u0131r \u2014 makine \u00f6\u011frenmesindeki hemen hemen her \u015fey ko\u015fullu olas\u0131l\u0131kt\u0131r.</p>'

+ '<div class="calc-formula"><div class="formula-label">KO\u015eULLU OLASILIK</div><div class="formula-main">$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0$$</div><div class="formula-sub">"B verildi\u011finde A\'n\u0131n olas\u0131l\u0131\u011f\u0131." \u00d6rneklem uzay\u0131n\u0131 sadece B\'nin ger\u00e7ekle\u015fti\u011fi sonu\u00e7larla s\u0131n\u0131rlar\u0131z, sonra bunlar\u0131n ka\u00e7\u0131n\u0131n A\'y\u0131 da i\u00e7erdi\u011fine bakar\u0131z.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">B Verildi\u011finde A</div><div class="card-body">B\'nin ger\u00e7ekle\u015fti\u011fini bilerek A\'n\u0131n olas\u0131l\u0131\u011f\u0131. Dikey \u00e7izgi "|" "verildi\u011finde" veya "ko\u015fuluyla" demektir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Ortak Olas\u0131l\u0131k</div><div class="card-body">Hem A hem B\'nin birlikte ger\u00e7ekle\u015fme olas\u0131l\u0131\u011f\u0131. Bu pay k\u0131sm\u0131d\u0131r.</div></div>'
+ '<div class="calc-card"><div class="card-title">B\'nin Marjinali</div><div class="card-body">A\'dan ba\u011f\u0131ms\u0131z olarak B\'nin toplam olas\u0131l\u0131\u011f\u0131. Bu payda k\u0131sm\u0131d\u0131r \u2014 B\'ye g\u00f6re normalize eder.</div></div>'
+ '</div>'

/* --- Plotly: Venn Diagram TR --- */
+ '<div id="plot-venn-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var thetaA=[];for(var i=0;i<=360;i++)thetaA.push(i*Math.PI/180);'
+ 'var xA=[];var yA=[];for(var i=0;i<thetaA.length;i++){xA.push(-0.4+1.2*Math.cos(thetaA[i]));yA.push(1.2*Math.sin(thetaA[i]));}'
+ 'var xB=[];var yB=[];for(var i=0;i<thetaA.length;i++){xB.push(0.4+1.2*Math.cos(thetaA[i]));yB.push(1.2*Math.sin(thetaA[i]));}'
+ 'var tA={x:xA,y:yA,mode:"lines",name:"Olay A",line:{color:"#c8a96e",width:2.5},fill:"toself",fillcolor:"rgba(200,169,110,0.15)"};'
+ 'var tB={x:xB,y:yB,mode:"lines",name:"Olay B",line:{color:"#4ecdc4",width:2.5},fill:"toself",fillcolor:"rgba(78,205,196,0.15)"};'
+ 'var ann=[{x:-0.9,y:0,text:"A",showarrow:false,font:{color:"#c8a96e",size:20}},{x:0.9,y:0,text:"B",showarrow:false,font:{color:"#4ecdc4",size:20}},{x:0,y:0,text:"A\u2229B",showarrow:false,font:{color:"#f87171",size:16}},{x:-2.2,y:1.8,text:"\u00d6rneklem Uzay\u0131 S",showarrow:false,font:{color:"#ebe6dc",size:13}}];'
+ 'var layout={title:{text:"Venn Diyagram\u0131: Ko\u015fullu Olas\u0131l\u0131k P(A|B)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.03)",zerolinecolor:"rgba(255,255,255,0.08)",range:[-2.5,2.5],showticklabels:false,showgrid:false},yaxis:{gridcolor:"rgba(255,255,255,0.03)",zerolinecolor:"rgba(255,255,255,0.08)",range:[-2,2.2],showticklabels:false,showgrid:false,scaleanchor:"x"},annotations:ann,margin:{t:50,r:30,b:30,l:30},showlegend:true,legend:{font:{color:"#ebe6dc"}},shapes:[{type:"rect",x0:-2.5,y0:-2,x1:2.5,y1:2.2,line:{color:"rgba(255,255,255,0.2)",width:1}}]};'
+ 'Plotly.newPlot("plot-venn-tr",[tA,tB],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi g\u00f6sterir:</strong> \u0130ki \u00f6rt\u00fc\u015fen daire, \u00f6rneklem uzay\u0131 S i\u00e7indeki A ve B olaylar\u0131n\u0131 temsil eder. \u00d6rt\u00fc\u015fen b\u00f6lge A\u2229B\'dir. P(A|B) sadece B dairesine odaklan\u0131r ve sorar: B\'nin ne kadar\u0131 ayn\u0131 zamanda A\'d\u0131r? Matematiksel olarak: P(A\u2229B) / P(B).</div></div>'

+ '<p class="l-text"><strong>Olas\u0131l\u0131\u011f\u0131n Zincir Kural\u0131:</strong> Ko\u015fullu olas\u0131l\u0131k form\u00fcl\u00fcn\u00fc yeniden d\u00fczenlersek, ortak olas\u0131l\u0131klar\u0131 par\u00e7alaman\u0131n yolunu veren zincir kural\u0131n\u0131 elde ederiz:</p>'

+ '<div class="calc-formula"><div class="formula-label">Z\u0130NC\u0130R KURALI (\u00c7ARPIM KURALI)</div><div class="formula-main">$$P(A \\cap B) = P(A|B) \\cdot P(B) = P(B|A) \\cdot P(A)$$</div><div class="formula-sub">A ve B\'nin ortak olas\u0131l\u0131\u011f\u0131, ko\u015fullu \u00e7arp\u0131 marjinal\'e e\u015fittir. Her iki y\u00f6nde de \u00e7al\u0131\u015f\u0131r.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">Z\u0130NC\u0130R KURALI (GENEL)</div><div class="formula-main">$$P(A_1 \\cap A_2 \\cap \\cdots \\cap A_n) = P(A_1) \\cdot P(A_2|A_1) \\cdot P(A_3|A_1,A_2) \\cdots$$</div><div class="formula-sub">Birden fazla olay i\u00e7in: ard\u0131\u015f\u0131k ko\u015fullular\u0131 \u00e7arp\u0131n. Dil modelleri c\u00fcmle olas\u0131l\u0131\u011f\u0131n\u0131 ayr\u0131\u015ft\u0131rmak i\u00e7in tam olarak bunu kullan\u0131r.</div></div>'

+ '<div class="calc-example"><div class="example-label">\u00c7ALI\u015eILMI\u015e \u00d6RNEK</div><div class="example-body"><strong>Dil modeli zincir kural\u0131:</strong> P("the cat sat") = ?<br><br>P("the cat sat") = P("the") \u00b7 P("cat"|"the") \u00b7 P("sat"|"the cat")<br><br>Diyelim: P("the") = 0.07, P("cat"|"the") = 0.02, P("sat"|"the cat") = 0.15<br><br>P("the cat sat") = 0.07 \u00d7 0.02 \u00d7 0.15 = <strong>0.00021</strong><br><br>Otoregressif dil modelleri (GPT) tam olarak b\u00f6yle metin \u00fcretir \u2014 kelime kelime, her biri \u00f6nceki t\u00fcm kelimelere ko\u015fullu.</div></div>'

+ '<div class="l-note"><strong>ML Ba\u011flant\u0131s\u0131:</strong> Her otoregressif dil modeli (GPT, LLaMA) c\u00fcmle olas\u0131l\u0131\u011f\u0131n\u0131 zincir kural\u0131yla ayr\u0131\u015ft\u0131r\u0131r: P(w\u2081, w\u2082, ..., w\u2099) = \u220f P(w\u1d62 | w\u2081, ..., w\u1d62\u208b\u2081). E\u011fitim, bu olas\u0131l\u0131\u011f\u0131 e\u011fitim k\u00fclliyat\u0131 \u00fczerinde maksimize eder. Bu modern NLP\'nin matematiksel \u00f6z\u00fcd\u00fcr.</div>'

/* ============================================================
   BOLUM 5: Bayes Teoremi
   ============================================================ */
+ '<h2 class="l-title">5. Bayes Teoremi</h2>'

+ '<div class="calc-highlight"><strong>G\u00fcnl\u00fck hayat benzetmesi:</strong> T\u0131bbi bir test %99 do\u011fru. Pozitif \u00e7\u0131kt\u0131n\u0131z. Hastal\u0131\u011fa sahip olma olas\u0131l\u0131\u011f\u0131n\u0131z %99 mu? <strong>Hay\u0131r!</strong> Hastal\u0131k nadir ise (10.000\'de 1), \u00e7o\u011fu pozitif yanl\u0131\u015f pozitiftir. Bayes teoremi, test do\u011frulu\u011funu hastal\u0131\u011f\u0131n nadirli\u011fiyle birle\u015ftirerek <em>ger\u00e7ek</em> olas\u0131l\u0131\u011f\u0131 s\u00f6yler.</div>'

+ '<p class="l-text">Bayes teoremi, makine \u00f6\u011frenmesindeki belki de en \u00f6nemli tek form\u00fcld\u00fcr. Yeni kan\u0131t g\u00f6zledi\u011fimizde <strong>inan\u00e7lar\u0131m\u0131z\u0131 nas\u0131l g\u00fcncelleyece\u011fimizi</strong> s\u00f6yler:</p>'

+ '<div class="calc-formula"><div class="formula-label">BAYES TEOREM\u0130</div><div class="formula-main">$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$</div><div class="formula-sub">Sonsal olas\u0131l\u0131k = Olabilirlik \u00d7 \u00d6nsel / Kan\u0131t. B kan\u0131t\u0131n\u0131 g\u00f6rd\u00fckten sonra A\'n\u0131n g\u00fcncellenmi\u015f olas\u0131l\u0131\u011f\u0131.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Sonsal (Posterior)</div><div class="card-body"><strong>\u0130stedi\u011fimiz:</strong> B kan\u0131t\u0131n\u0131 g\u00f6rd\u00fckten sonra A\'n\u0131n g\u00fcncellenmi\u015f olas\u0131l\u0131\u011f\u0131.</div></div>'
+ '<div class="calc-card"><div class="card-title">Olabilirlik (Likelihood)</div><div class="card-body"><strong>A do\u011fruysa kan\u0131t ne kadar olas\u0131?</strong> Modelin hesaplad\u0131\u011f\u0131 k\u0131s\u0131m.</div></div>'
+ '<div class="calc-card"><div class="card-title">\u00d6nsel (Prior)</div><div class="card-body"><strong>Kan\u0131ttan \u00f6nceki inan\u00e7.</strong> Herhangi bir veri g\u00f6rmeden \u00f6nceki ba\u015flang\u0131\u00e7 varsay\u0131m\u0131m\u0131z.</div></div>'
+ '<div class="calc-card"><div class="card-title">Kan\u0131t (Evidence)</div><div class="card-body"><strong>Kan\u0131t genel olarak ne kadar yayg\u0131n?</strong> Sonucu ge\u00e7erli bir olas\u0131l\u0131k yapacak \u015fekilde normalize eder.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">TOPLAM OLASILIK YASASI</div><div class="formula-main">$$P(B) = P(B|A) \\cdot P(A) + P(B|A^c) \\cdot P(A^c)$$</div><div class="formula-sub">P(B)\'yi t\u00fcm olas\u0131 "nedenler" (A ve A-de\u011fil) \u00fczerinden toplayarak hesaplay\u0131n. Bayes payda de\u011ferini verir.</div></div>'

+ '<div class="calc-example"><div class="example-label">\u00c7ALI\u015eILMI\u015e \u00d6RNEK</div><div class="example-body"><strong>Bayes Teoremi ile Spam Tespiti:</strong><br><br>Verilenler:<br>\u2022 P(spam) = 0.3 (e-postalar\u0131n %30\'u spam) \u2190 \u00f6nsel<br>\u2022 P("free" | spam) = 0.8 (spam\'lar\u0131n %80\'i "free" i\u00e7erir) \u2190 olabilirlik<br>\u2022 P("free" | spam de\u011fil) = 0.1 (me\u015fru e-postalar\u0131n %10\'u "free" i\u00e7erir)<br><br>Ad\u0131m 1: Toplam olas\u0131l\u0131k yasas\u0131yla P("free") hesapla:<br>P("free") = P("free"|spam)\u00b7P(spam) + P("free"|spam de\u011fil)\u00b7P(spam de\u011fil)<br>= 0.8 \u00d7 0.3 + 0.1 \u00d7 0.7 = 0.24 + 0.07 = <strong>0.31</strong><br><br>Ad\u0131m 2: Bayes teoremini uygula:<br>P(spam | "free") = P("free"|spam) \u00d7 P(spam) / P("free")<br>= 0.8 \u00d7 0.3 / 0.31 = 0.24 / 0.31 = <strong>0.774</strong><br><br>"free" g\u00f6rmek inanc\u0131m\u0131z\u0131 %30\'dan %77.4\'e g\u00fcnceller \u2014 b\u00fcy\u00fck bir s\u0131\u00e7rama!</div></div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">\u00d6nsel</div><div class="flow-value">P(spam) = 0.30</div></div>'
+ '<div class="flow-arrow">\u2192</div>'
+ '<div class="flow-step"><div class="flow-label">+ Kan\u0131t</div><div class="flow-value">"free" g\u00f6zlendi</div></div>'
+ '<div class="flow-arrow">\u2192</div>'
+ '<div class="flow-step"><div class="flow-label">Sonsal</div><div class="flow-value">P(spam|"free") = 0.77</div></div>'
+ '</div>'

+ '<div class="l-note"><strong>ML Ba\u011flant\u0131s\u0131:</strong> Naive Bayes s\u0131n\u0131fland\u0131r\u0131c\u0131lar\u0131 Bayes teoremini do\u011frudan kullan\u0131r. BERT ve GPT de \u00f6rt\u00fck olarak Bayesian muhakeme yapar \u2014 g\u00f6zlenen token\'lara (kan\u0131t) dayanarak i\u00e7 temsillerini g\u00fcncellerler. T\u00fcm Bayesian ML alan\u0131 bu tek form\u00fcl \u00fczerine in\u015fa edilmi\u015ftir.</div>'

+ '<div class="think-box"><div class="think-label">D\u00dc\u015e\u00dcN\u00dcN</div><div class="think-body">T\u0131bbi test \u00f6rne\u011finde: hastal\u0131k yayg\u0131nl\u0131\u011f\u0131 = %0.01, test duyarl\u0131l\u0131\u011f\u0131 = %99, yanl\u0131\u015f pozitif oran\u0131 = %1. Pozitif \u00e7\u0131karsan\u0131z, P(hastal\u0131k|pozitif) \u2248 <strong>%1</strong>. %99 do\u011fruluklu teste ra\u011fmen, pozitiflerin sadece %1\'i do\u011fru! Bu temel oran yan\u0131lg\u0131s\u0131d\u0131r \u2014 ve Bayes teoremi \u00e7aredir.</div></div>'

/* ============================================================
   BOLUM 6: Bagimsizlik
   ============================================================ */
+ '<h2 class="l-title">6. Ba\u011f\u0131ms\u0131zl\u0131k</h2>'

+ '<div class="calc-highlight"><strong>G\u00fcnl\u00fck hayat benzetmesi:</strong> Yaz\u0131-tura atma ve zar atma ba\u011f\u0131ms\u0131zd\u0131r \u2014 yaz\u0131-tura sonucu zar hakk\u0131nda bilgi vermez. Ama bir desteden iki kart \u00e7ekmek (yerine koymadan) ba\u011f\u0131ms\u0131z DE\u011e\u0130LD\u0130R \u2014 ilk as \u00e7ekmek ikinci as \u00e7ekme olas\u0131l\u0131\u011f\u0131n\u0131 de\u011fi\u015ftirir.</div>'

+ '<p class="l-text">\u0130ki olay, birini bilmek di\u011feri hakk\u0131nda <em>hi\u00e7bir bilgi</em> vermiyorsa <strong>ba\u011f\u0131ms\u0131zd\u0131r</strong>:</p>'

+ '<div class="calc-formula"><div class="formula-label">BA\u011eIMSIZLIK TANIMI</div><div class="formula-main">$$P(A \\cap B) = P(A) \\cdot P(B)$$</div><div class="formula-sub">A ve B ancak ve ancak ortak olas\u0131l\u0131k marjinallerin \u00e7arp\u0131m\u0131na e\u015fitse ba\u011f\u0131ms\u0131zd\u0131r.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">E\u015eDE\u011eER TANIM</div><div class="formula-main">$$P(A|B) = P(A) \\quad \\text{and} \\quad P(B|A) = P(B)$$</div><div class="formula-sub">B\'yi bilmek A\'n\u0131n olas\u0131l\u0131\u011f\u0131n\u0131 de\u011fi\u015ftirmez, ve tersi.</div></div>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">BA\u011eIMSIZ</div><div class="compare-item">\u2022 P(A\u2229B) = P(A)\u00b7P(B)</div><div class="compare-item">\u2022 P(A|B) = P(A)</div><div class="compare-item">\u2022 B\'yi bilmek A hakk\u0131nda bilgi VERMEZ</div><div class="compare-item">\u2022 \u00d6rnek: ayr\u0131 yaz\u0131-tura at\u0131\u015flar\u0131</div></div><div class="compare-col"><div class="compare-title">BA\u011eIMLI</div><div class="compare-item">\u2022 P(A\u2229B) \u2260 P(A)\u00b7P(B)</div><div class="compare-item">\u2022 P(A|B) \u2260 P(A)</div><div class="compare-item">\u2022 B\'yi bilmek A\'n\u0131n olas\u0131l\u0131\u011f\u0131n\u0131 DE\u011e\u0130\u015eT\u0130R\u0130R</div><div class="compare-item">\u2022 \u00d6rnek: bir c\u00fcmledeki ard\u0131\u015f\u0131k kelimeler</div></div></div>'

+ '<p class="l-text"><strong>Ko\u015fullu Ba\u011f\u0131ms\u0131zl\u0131k:</strong> Olaylar marjinal olarak ba\u011f\u0131ml\u0131 olsalar bile, \u00fc\u00e7\u00fcnc\u00fc bir de\u011fi\u015fken verildi\u011finde ko\u015fullu ba\u011f\u0131ms\u0131z olabilirler:</p>'

+ '<div class="calc-formula"><div class="formula-label">KO\u015eULLU BA\u011eIMSIZLIK</div><div class="formula-main">$$P(A \\cap B | C) = P(A|C) \\cdot P(B|C)$$</div><div class="formula-sub">C biliniyorsa A ve B ko\u015fullu ba\u011f\u0131ms\u0131zd\u0131r. C bilinirken A, B hakk\u0131nda ekstra bilgi vermez.</div></div>'

+ '<div class="calc-example"><div class="example-label">\u00c7ALI\u015eILMI\u015e \u00d6RNEK</div><div class="example-body"><strong>Naive Bayes varsay\u0131m\u0131:</strong> x\u2081="free", x\u2082="win", x\u2083="click" \u00f6zellikli bir spam s\u0131n\u0131fland\u0131r\u0131c\u0131s\u0131nda:<br><br>"Saf" varsay\u0131m: \u00f6zellikler s\u0131n\u0131f verildi\u011finde ko\u015fullu ba\u011f\u0131ms\u0131zd\u0131r:<br>P(x\u2081, x\u2082, x\u2083 | spam) = P(x\u2081|spam) \u00b7 P(x\u2082|spam) \u00b7 P(x\u2083|spam)<br><br>Bu neredeyse kesinlikle yanl\u0131\u015ft\u0131r (kelimeler ili\u015fkilidir!), ama pratikte \u015fa\u015f\u0131rt\u0131c\u0131 derecede iyi \u00e7al\u0131\u015f\u0131r \u00e7\u00fcnk\u00fc:<br>1. Sadece s\u0131n\u0131flar\u0131n <em>s\u0131ralamas\u0131na</em> ihtiyac\u0131m\u0131z var, kesin olas\u0131l\u0131klara de\u011fil<br>2. Ba\u011f\u0131ms\u0131zl\u0131k hatalar\u0131 birbirini iptal etme e\u011filimindedir<br>3. Model e\u011fitmesi \u00e7ok h\u0131zl\u0131d\u0131r ve a\u015f\u0131r\u0131 uymaya dayan\u0131kl\u0131d\u0131r</div></div>'

+ '<div class="l-note"><strong>ML Ba\u011flant\u0131s\u0131:</strong> Naive Bayes s\u0131n\u0131fland\u0131r\u0131c\u0131s\u0131na "saf" denmesinin nedeni, \u00f6zelliklerin s\u0131n\u0131f etiketi verildi\u011finde ko\u015fullu ba\u011f\u0131ms\u0131z oldu\u011funu varsaymas\u0131d\u0131r. Bu ger\u00e7ek\u00e7i olmayan varsay\u0131ma ra\u011fmen, metin s\u0131n\u0131fland\u0131rma i\u00e7in \u015fa\u015f\u0131rt\u0131c\u0131 derecede etkilidir.</div>'

/* ============================================================
   BOLUM 7: Rastgele Değişkenler
   ============================================================ */
+ '<h2 class="l-title">7. Rastgele De\u011fi\u015fkenler</h2>'

+ '<div class="calc-highlight"><strong>G\u00fcnl\u00fck hayat benzetmesi:</strong> Zar att\u0131\u011f\u0131n\u0131zda sonu\u00e7 (1-6) rastgeledir. Bir <em>rastgele de\u011fi\u015fken</em> her sonu\u00e7a bir say\u0131 atar. X = "g\u00f6sterilen say\u0131" (X \u2208 {1,...,6}) veya Y = "sonu\u00e7 \u00e7ift mi?" (Y \u2208 {0,1}) tan\u0131mlayabilirsiniz.</div>'

+ '<p class="l-text">Bir <strong>rastgele de\u011fi\u015fken</strong>, \u00f6rneklem uzay\u0131ndaki her sonu\u00e7u bir say\u0131ya e\u015fleyen bir fonksiyondur. Bu k\u00f6pr\u00fc, rastgele olaylar \u00fczerinde kalk\u00fcl\u00fcs ve cebir ara\u00e7lar\u0131n\u0131 kullanmam\u0131z\u0131 sa\u011flar.</p>'

+ '<div class="calc-formula"><div class="formula-label">RASTGELE DE\u011e\u0130\u015eKEN</div><div class="formula-main">$$X: S \\to \\mathbb{R}$$</div><div class="formula-sub">X, \u00f6rneklem uzay\u0131 S\'den reel say\u0131lara bir fonksiyondur. Her \u03c9 sonu\u00e7u X(\u03c9) say\u0131s\u0131na e\u015flenir.</div></div>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">KES\u0130KL\u0130 R.D.</div><div class="compare-item">\u2022 <strong>Say\u0131labilir</strong> de\u011ferler al\u0131r</div><div class="compare-item">\u2022 \u00d6rnekler: zar (1-6), kelime say\u0131s\u0131, s\u0131n\u0131f etiketi</div><div class="compare-item">\u2022 <strong>OKF</strong> (Olas\u0131l\u0131k K\u00fctle Fonksiyonu) ile tan\u0131mlan\u0131r</div><div class="compare-item">\u2022 P(X = x) her de\u011ferin olas\u0131l\u0131\u011f\u0131n\u0131 verir</div><div class="compare-item">\u2022 T\u00fcm P(X=x) = 1</div></div><div class="compare-col"><div class="compare-title">S\u00dcREKL\u0130 R.D.</div><div class="compare-item">\u2022 <strong>Say\u0131lamaz</strong> de\u011ferler al\u0131r (herhangi bir reel say\u0131)</div><div class="compare-item">\u2022 \u00d6rnekler: s\u0131cakl\u0131k, a\u011f\u0131rl\u0131k, g\u00f6m\u00fclme de\u011feri</div><div class="compare-item">\u2022 <strong>OYF</strong> (Olas\u0131l\u0131k Yo\u011funluk Fonksiyonu) ile tan\u0131mlan\u0131r</div><div class="compare-item">\u2022 Tek bir de\u011fer i\u00e7in P(X = x) = 0!</div><div class="compare-item">\u2022 OYF\'nin t\u00fcm x \u00fczerine integrali = 1</div></div></div>'

+ '<div class="calc-formula"><div class="formula-label">OKF (KES\u0130KL\u0130)</div><div class="formula-main">$$p(x) = P(X = x), \\quad \\sum_{\\text{all } x} p(x) = 1$$</div><div class="formula-sub">OKF, her belirli de\u011ferin olas\u0131l\u0131\u011f\u0131n\u0131 s\u00f6yler. T\u00fcm olas\u0131l\u0131klar 1\'e toplamal\u0131d\u0131r.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">OYF (S\u00dcREKL\u0130)</div><div class="formula-main">$$P(a \\leq X \\leq b) = \\int_a^b f(x)\\,dx, \\quad \\int_{-\\infty}^{\\infty} f(x)\\,dx = 1$$</div><div class="formula-sub">OYF olas\u0131l\u0131k de\u011fil yo\u011funluk verir. Olas\u0131l\u0131k elde etmek i\u00e7in bir aral\u0131k \u00fczerine integre edin. E\u011fri alt\u0131ndaki toplam alan 1\'e e\u015fittir.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">BDF (B\u0130R\u0130K\u0130ML\u0130 DA\u011eILIM)</div><div class="formula-main">$$F(x) = P(X \\leq x)$$</div><div class="formula-sub">BDF, X\'in x\'e e\u015fit veya k\u00fc\u00e7\u00fck olma olas\u0131l\u0131\u011f\u0131n\u0131 verir. Azalmayan, 0\'da ba\u015flar ve 1\'de biter.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">K\u00fctle Fonksiyonu</div><div class="card-body">Kesikli de\u011fi\u015fkenler i\u00e7in. Adil zarda P(X=3) = 1/6. \u00c7ubuklar olarak g\u00f6rselle\u015ftirilir. Her \u00e7ubuk y\u00fcksekli\u011fi = olas\u0131l\u0131k.</div></div>'
+ '<div class="calc-card"><div class="card-title">Yo\u011funluk Fonksiyonu</div><div class="card-body">S\u00fcrekli de\u011fi\u015fkenler i\u00e7in. f(x) 1\'den b\u00fcy\u00fck olabilir! Sadece e\u011fri alt\u0131ndaki alanlar olas\u0131l\u0131kt\u0131r. \u00c7an e\u011frisi bir OYF\'dir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Birikimli Fonksiyon</div><div class="card-body">Her iki t\u00fcr i\u00e7in ge\u00e7erli. F(x) = P(X \u2264 x). Her zaman 0\'dan 1\'e gider. OKF/OYF\'nin kayan toplam\u0131d\u0131r.</div></div>'
+ '</div>'

/* --- Plotly: PMF TR --- */
+ '<div id="plot-pmf-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var xv=[1,2,3,4,5,6];var yv=[1/6,1/6,1/6,1/6,1/6,1/6];'
+ 'var t1={x:xv,y:yv,type:"bar",name:"P(X = x)",marker:{color:["#c8a96e","#4ecdc4","#a78bfa","#f87171","#34d399","#fb923c"]},width:0.5};'
+ 'var layout={title:{text:"Adil Zar OKF\'si",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x (sonu\u00e7)",dtick:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"P(X = x)",range:[0,0.25]},margin:{t:50,r:30,b:50,l:60},showlegend:false};'
+ 'Plotly.newPlot("plot-pmf-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi g\u00f6sterir:</strong> Adil zar\u0131n OKF\'si. Her sonu\u00e7 (1\'den 6\'ya) e\u015fit olas\u0131l\u0131\u011fa sahiptir: 1/6 \u2248 0.167. \u00c7ubuk y\u00fckseklikleri her belirli sonucun olas\u0131l\u0131\u011f\u0131n\u0131 temsil eder. T\u00fcm \u00e7ubuklar 1\'e toplar.</div></div>'

+ '<div class="l-note"><strong>ML Ba\u011flant\u0131s\u0131:</strong> S\u0131n\u0131fland\u0131rmada model \u00e7\u0131kt\u0131s\u0131 s\u0131n\u0131flar \u00fczerinde bir OKF\'dir: P(s\u0131n\u0131f=kedi)=0.8, P(s\u0131n\u0131f=k\u00f6pek)=0.15, P(s\u0131n\u0131f=ku\u015f)=0.05. Dil modellemesinde, her konumda t\u00fcm s\u00f6zl\u00fck \u00fczerinde bir OKF\'dir.</div>'

/* ============================================================
   BOLUM 8: Beklenen Değer & Varyans
   ============================================================ */
+ '<h2 class="l-title">8. Beklenen De\u011fer & Varyans</h2>'

+ '<div class="calc-highlight"><strong>G\u00fcnl\u00fck hayat benzetmesi:</strong> Yar\u0131 yar\u0131ya 10\u20ba kazand\u0131\u011f\u0131n\u0131z ve 6\u20ba kaybetti\u011finiz bir oyunda, oyun ba\u015f\u0131na <em>beklenen de\u011feriniz</em> 0.5\u00d710 + 0.5\u00d7(-6) = 2\u20ba\'dir. Tek bir oyunda tam 2\u20ba kazanmazs\u0131n\u0131z, ama uzun vadede oyun ba\u015f\u0131na ortalama 2\u20ba kazan\u0131rs\u0131n\u0131z.</div>'

+ '<p class="l-text"><strong>Beklenen de\u011fer</strong> (ortalama) bize "ortalama" sonucu s\u00f6yler. <strong>Varyans</strong> sonu\u00e7lar\u0131n bu ortalaman\u0131n etraf\u0131nda ne kadar da\u011f\u0131ld\u0131\u011f\u0131n\u0131 s\u00f6yler. Birlikte, bir da\u011f\u0131l\u0131m\u0131n en \u00f6nemli \u00f6zelliklerini \u00f6zetlerler.</p>'

+ '<div class="calc-formula"><div class="formula-label">BEKLENEN DE\u011eER (KES\u0130KL\u0130)</div><div class="formula-main">$$E[X] = \\sum_x x \\cdot P(X = x)$$</div><div class="formula-sub">T\u00fcm olas\u0131 de\u011ferlerin a\u011f\u0131rl\u0131kl\u0131 ortalamas\u0131, olas\u0131l\u0131klar\u0131yla a\u011f\u0131rl\u0131kland\u0131r\u0131lm\u0131\u015f.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">BEKLENEN DE\u011eER (S\u00dcREKL\u0130)</div><div class="formula-main">$$E[X] = \\int_{-\\infty}^{\\infty} x \\cdot f(x)\\,dx$$</div><div class="formula-sub">Ayn\u0131 fikir ama toplam yerine integral. x \u00e7arp\u0131 yo\u011funlu\u011fun integrali.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Beklenen De\u011fer</div><div class="card-body"><strong>Ortalama</strong> veya \u03bc olarak da adland\u0131r\u0131l\u0131r. Da\u011f\u0131l\u0131m\u0131n a\u011f\u0131rl\u0131k merkezi. X\'in alabilece\u011fi bir de\u011fer olmak zorunda de\u011fil!</div></div>'
+ '<div class="calc-card"><div class="card-title">M\u00fc (Ortalama)</div><div class="card-body">E[X] i\u00e7in yayg\u0131n g\u00f6sterim. Adil zar i\u00e7in: \u03bc = (1+2+3+4+5+6)/6 = 3.5. Hi\u00e7 3.5 atmazs\u0131n\u0131z, ama ortalamad\u0131r.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Beklentinin temel \u00f6zellikleri (do\u011frusall\u0131k):</strong></p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">E[aX + b] = aE[X] + b</div><div class="step-detail">Sabitler d\u0131\u015far\u0131 \u00e7\u0131kar. b ile kayd\u0131rma ortalamay\u0131 b kayd\u0131r\u0131r. a ile \u00f6l\u00e7ekleme ortalamay\u0131 a \u00f6l\u00e7ekler.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">E[X + Y] = E[X] + E[Y]</div><div class="step-detail">Toplam\u0131n beklentisi = beklentilerin toplam\u0131. X ve Y ba\u011f\u0131ml\u0131 olsa bile \u00e7al\u0131\u015f\u0131r! Bu beklentinin do\u011frusall\u0131\u011f\u0131d\u0131r.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">E[XY] = E[X]\u00b7E[Y] (ba\u011f\u0131ms\u0131zsa)</div><div class="step-detail">\u00c7arp\u0131m kural\u0131 sadece ba\u011f\u0131ms\u0131z de\u011fi\u015fkenler i\u00e7in ge\u00e7erlidir. Ba\u011f\u0131ml\u0131 de\u011fi\u015fkenler i\u00e7in E[XY] kovaryans i\u00e7erir.</div></div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">VARYANS</div><div class="formula-main">$$\\text{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2$$</div><div class="formula-sub">Varyans, ortalamadan ortalama kare sapmas\u0131n\u0131 \u00f6l\u00e7er. \u0130kinci form hesaplama k\u0131sayoludur.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">STANDART SAPMA</div><div class="formula-main">$$\\sigma = \\sqrt{\\text{Var}(X)}$$</div><div class="formula-sub">Varyans\u0131n karek\u00f6k\u00fc. X ile ayn\u0131 birimde, bu y\u00fczden varyanstan daha yorumlanabilir.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Varyans</div><div class="card-body">Da\u011f\u0131l\u0131m\u0131n ne kadar yay\u0131ld\u0131\u011f\u0131. Y\u00fcksek varyans = geni\u015f yay\u0131l\u0131m. D\u00fc\u015f\u00fck varyans = ortalama etraf\u0131nda yo\u011funla\u015fma.</div></div>'
+ '<div class="calc-card"><div class="card-title">Standart Sapma</div><div class="card-body">Varyans\u0131n karek\u00f6k\u00fc. Orijinal birimde. Normal da\u011f\u0131l\u0131m i\u00e7in verinin ~%68\'i \u03bc \u00b1 \u03c3 i\u00e7ine d\u00fc\u015fer.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">\u00c7ALI\u015eILMI\u015e \u00d6RNEK</div><div class="example-body"><strong>Adil zar:</strong> X = zar atma sonucu.<br><br>E[X] = (1+2+3+4+5+6)/6 = 21/6 = <strong>3.5</strong><br><br>E[X\u00b2] = (1+4+9+16+25+36)/6 = 91/6 \u2248 15.167<br><br>Var(X) = E[X\u00b2] - (E[X])\u00b2 = 91/6 - (7/2)\u00b2 = 91/6 - 49/4 = 35/12 \u2248 <strong>2.917</strong><br><br>\u03c3 = \u221a(35/12) \u2248 <strong>1.708</strong></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Adil zar: sonuclar ve olasiliklar</span>\noutcomes = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>, <span class="num">6</span>])\nprobs = np.<span class="fn">array</span>([<span class="num">1/6</span>] * <span class="num">6</span>)\n\n<span class="cm"># Beklenen deger: E[X] = sum(x * p(x))</span>\nmean = np.<span class="fn">sum</span>(outcomes * probs)\n<span class="fn">print</span>(<span class="str">f"E[X] = {mean}"</span>)         <span class="cm"># 3.5</span>\n\n<span class="cm"># Varyans: E[X^2] - (E[X])^2</span>\ne_x2 = np.<span class="fn">sum</span>(outcomes**<span class="num">2</span> * probs)\nvar = e_x2 - mean**<span class="num">2</span>\n<span class="fn">print</span>(<span class="str">f"Var(X) = {var:.4f}"</span>)     <span class="cm"># 2.9167</span>\n<span class="fn">print</span>(<span class="str">f"Std(X) = {np.sqrt(var):.4f}"</span>)  <span class="cm"># 1.7078</span>\n\n<span class="cm"># NumPy ile dogrula</span>\nsamples = np.random.<span class="fn">choice</span>(outcomes, size=<span class="num">100000</span>)\n<span class="fn">print</span>(<span class="str">f"Ornek ortalamasi: {samples.mean():.3f}"</span>)\n<span class="fn">print</span>(<span class="str">f"Ornek std: {samples.std():.3f}"</span>)</code></pre></div>'

+ '<div class="l-note"><strong>ML Ba\u011flant\u0131s\u0131:</strong> ML\'deki kay\u0131p fonksiyonu bir beklenen de\u011ferdir: L = E[loss(tahmin, ger\u00e7ek etiket)]. Bu beklentiyi e\u011fitim grubu \u00fczerindeki toplamla yakla\u015ft\u0131r\u0131r\u0131z (minibatch gradient descent). Varyans da kritik rol oynar: y\u00fcksek varyansl\u0131 gradyanlar e\u011fitimi karars\u0131z yapar, bu y\u00fczden batch normalization ve gradient clipping gibi teknikler vard\u0131r.</div>'

/* ============================================================
   BOLUM 9: Yaygin Dagilimlar
   ============================================================ */
+ '<h2 class="l-title">9. Yayg\u0131n Da\u011f\u0131l\u0131mlar</h2>'

+ '<div class="calc-highlight"><strong>Temel fikir:</strong> Her olas\u0131 sonu\u00e7 i\u00e7in ayr\u0131 olas\u0131l\u0131klar belirtmek yerine, birka\u00e7 parametreli adland\u0131r\u0131lm\u0131\u015f da\u011f\u0131l\u0131mlar kullan\u0131r\u0131z. Verinin "\u03bc=0, \u03c3=1 Gauss da\u011f\u0131l\u0131m\u0131" izledi\u011fini bilmek, da\u011f\u0131l\u0131m hakk\u0131nda her \u015feyi anlat\u0131r. Bu adland\u0131r\u0131lm\u0131\u015f da\u011f\u0131l\u0131mlar t\u00fcm olas\u0131l\u0131ksal ML modellerinin yap\u0131 ta\u015flar\u0131d\u0131r.</div>'

+ '<p class="l-text">ML\'de en s\u0131k kar\u015f\u0131la\u015faca\u011f\u0131n\u0131z da\u011f\u0131l\u0131mlar:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Bernoulli(p)</div><div class="card-body">Tek ikili deneme. X \u2208 {0,1}. P(X=1) = p. <strong>Kullan\u0131m:</strong> yaz\u0131-tura, ikili s\u0131n\u0131fland\u0131rma. Ortalama = p, Var = p(1-p).</div></div>'
+ '<div class="calc-card"><div class="card-title">Binom(n,p)</div><div class="card-body">n ba\u011f\u0131ms\u0131z Bernoulli denemesindeki ba\u015far\u0131 say\u0131s\u0131. <strong>Kullan\u0131m:</strong> "100 e-postadan ka\u00e7\u0131 spam?" Ortalama = np.</div></div>'
+ '<div class="calc-card"><div class="card-title">Uniform(a,b)</div><div class="card-body">[a,b] i\u00e7indeki t\u00fcm de\u011ferler e\u015fit olas\u0131l\u0131kl\u0131. f(x) = 1/(b-a). <strong>Kullan\u0131m:</strong> rastgele ba\u015flatma, dropout maskeleri.</div></div>'
+ '<div class="calc-card"><div class="card-title">Kategorik(p\u2081,...,p\u2096)</div><div class="card-body">Bernoulli\'nin K s\u0131n\u0131fa genellemesi. <strong>Kullan\u0131m:</strong> softmax \u00e7\u0131kt\u0131s\u0131, sonraki kelime tahmini. Toplam\u0131 1\'dir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Gauss(\u03bc,\u03c3\u00b2)</div><div class="card-body">\u00c7an e\u011frisi! Ortalama \u03bc ve varyans \u03c3\u00b2 ile tan\u0131mlan\u0131r. <strong>Kullan\u0131m:</strong> a\u011f\u0131rl\u0131k ba\u015flatma, g\u00fcr\u00fclt\u00fc modelleme, gizli uzaylar (VAE). En \u00f6nemli s\u00fcrekli da\u011f\u0131l\u0131m.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">GAUSS (NORMAL) OYF</div><div class="formula-main">$$f(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$</div><div class="formula-sub">\u00dcnl\u00fc \u00e7an e\u011frisi. Ortalama \u03bc (merkez) ve varyans \u03c3\u00b2 (geni\u015flik) ile parametrelenir. Standart normal \u03bc=0, \u03c3=1\'dir.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">B\u0130NOM OKF</div><div class="formula-main">$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$$</div><div class="formula-sub">Her biri p ba\u015far\u0131 olas\u0131l\u0131\u011f\u0131na sahip n denemede tam k ba\u015far\u0131 olas\u0131l\u0131\u011f\u0131.</div></div>'

/* --- Plotly: Gaussian TR --- */
+ '<div id="plot-gauss-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'function gauss(x,mu,sig){return(1/(sig*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*Math.pow((x-mu)/sig,2));}'
+ 'var xv=[];for(var i=-50;i<=50;i++)xv.push(i/10);'
+ 'var y1=xv.map(function(x){return gauss(x,0,1);});'
+ 'var y2=xv.map(function(x){return gauss(x,0,2);});'
+ 'var y3=xv.map(function(x){return gauss(x,2,0.7);});'
+ 'var t1={x:xv,y:y1,mode:"lines",name:"\u03bc=0, \u03c3=1 (standart)",line:{color:"#c8a96e",width:2.5}};'
+ 'var t2={x:xv,y:y2,mode:"lines",name:"\u03bc=0, \u03c3=2 (geni\u015f)",line:{color:"#4ecdc4",width:2.5}};'
+ 'var t3={x:xv,y:y3,mode:"lines",name:"\u03bc=2, \u03c3=0.7 (kayd\u0131r\u0131lm\u0131\u015f, dar)",line:{color:"#a78bfa",width:2.5}};'
+ 'var layout={title:{text:"Gauss (Normal) Da\u011f\u0131l\u0131mlar\u0131",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-5,5]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)",range:[0,0.65]},margin:{t:50,r:30,b:50,l:60},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-gauss-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi g\u00f6sterir:</strong> Farkl\u0131 parametreli \u00fc\u00e7 Gauss da\u011f\u0131l\u0131m\u0131. Alt\u0131n rengi e\u011fri standart normaldir (ortalama=0, std=1). Turkuaz e\u011fri daha b\u00fcy\u00fck \u03c3\'ya sahip oldu\u011fundan daha geni\u015f ve k\u0131sad\u0131r. Mor e\u011fri sa\u011fa kayd\u0131r\u0131lm\u0131\u015f (\u03bc=2) ve daha dard\u0131r (\u03c3=0.7). \u03bc\'y\u00fc de\u011fi\u015ftirmek e\u011friyi kayd\u0131r\u0131r; \u03c3\'y\u0131 de\u011fi\u015ftirmek gerer veya s\u0131k\u0131\u015ft\u0131r\u0131r.</div></div>'

/* --- Plotly: CDF TR --- */
+ '<div id="plot-cdf-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'function normalCDF(x){var t=1/(1+0.2316419*Math.abs(x));var d=0.3989422802*Math.exp(-x*x/2);var p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.8212560+t*1.3302744))));return x>0?1-p:p;}'
+ 'var xv=[];var yv=[];for(var i=-40;i<=40;i++){var x=i/10;xv.push(x);yv.push(normalCDF(x));}'
+ 'var t1={x:xv,y:yv,mode:"lines",name:"BDF: \u03a6(x) = P(X \u2264 x)",line:{color:"#f87171",width:2.5}};'
+ 'var ann=[{x:0,y:0.5,text:"P(X \u2264 0) = 0.5",showarrow:true,arrowhead:2,ax:60,ay:-30,font:{color:"#f87171",size:12}},{x:1.96,y:0.975,text:"P(X \u2264 1.96) = 0.975",showarrow:true,arrowhead:2,ax:-10,ay:-30,font:{color:"#ebe6dc",size:11}}];'
+ 'var layout={title:{text:"Standart Normal Da\u011f\u0131l\u0131m BDF\'si",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x",range:[-4,4]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"\u03a6(x) = P(X \u2264 x)",range:[0,1.05]},annotations:ann,margin:{t:50,r:30,b:50,l:60},showlegend:false};'
+ 'Plotly.newPlot("plot-cdf-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},250)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi g\u00f6sterir:</strong> Standart normal da\u011f\u0131l\u0131m\u0131n BDF\'si. Her x i\u00e7in P(X \u2264 x) g\u00f6sterir. x=0\'da BDF 0.5\'tir (olas\u0131l\u0131\u011f\u0131n %50\'si ortlaman\u0131n alt\u0131ndad\u0131r). x=1.96\'da BDF 0.975\'tir, yani de\u011ferlerin %97.5\'i ortlaman\u0131n 1.96 standart sapma \u00fczerinde kal\u0131r. "%95 g\u00fcven aral\u0131\u011f\u0131" buradan gelir (\u00b11.96\u03c3).</div></div>'

/* --- Plotly: Binomial TR --- */
+ '<div id="plot-binom-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'function binomCoeff(n,k){if(k<0||k>n)return 0;if(k===0||k===n)return 1;var c=1;for(var i=0;i<k;i++){c=c*(n-i)/(i+1);}return c;}'
+ 'function binomPMF(k,n,p){return binomCoeff(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}'
+ 'var xv=[];var y1=[];var y2=[];for(var k=0;k<=20;k++){xv.push(k);y1.push(binomPMF(k,20,0.5));y2.push(binomPMF(k,20,0.3));}'
+ 'var t1={x:xv,y:y1,type:"bar",name:"Bin(20, 0.5)",marker:{color:"#c8a96e",opacity:0.7},width:0.35,offset:-0.2};'
+ 'var t2={x:xv,y:y2,type:"bar",name:"Bin(20, 0.3)",marker:{color:"#4ecdc4",opacity:0.7},width:0.35,offset:0.15};'
+ 'var layout={title:{text:"Binom OKF: n=20 deneme",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"k (ba\u015far\u0131 say\u0131s\u0131)",dtick:2},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"P(X = k)"},margin:{t:50,r:30,b:50,l:60},showlegend:true,legend:{font:{color:"#ebe6dc"}},barmode:"group"};'
+ 'Plotly.newPlot("plot-binom-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},300)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi g\u00f6sterir:</strong> n=20 denemeli iki Binom da\u011f\u0131l\u0131m\u0131. Alt\u0131n \u00e7ubuklar p=0.5 (adil yaz\u0131-tura, 10\'da merkezli). Turkuaz \u00e7ubuklar p=0.3 (e\u011fimli, 6\'da merkezli). B\u00fcy\u00fck n i\u00e7in binom Gauss\'a yakla\u015f\u0131r (Merkezi Limit Teoremi).</div></div>'

+ '<div class="l-warn"><strong>\u00d6nemli:</strong> Gauss da\u011f\u0131l\u0131m\u0131 ML\'de her yerde g\u00f6r\u00fcn\u00fcr: a\u011f\u0131rl\u0131k ba\u015flatma (Xavier, He), \u00fcretken modellerde g\u00fcr\u00fclt\u00fc, VAE\'lerdeki gizli uzaylar, Merkezi Limit Teoremi (\u00f6rnek ortalamalar\u0131 yakla\u015f\u0131k Gauss\'tur) ve reg\u00fclarizasyon (L2 cezas\u0131 = a\u011f\u0131rl\u0131klar \u00fczerinde Gauss \u00f6nseli).</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\n<span class="cm"># Bernoulli: tek yazi-tura</span>\nbern = stats.<span class="fn">bernoulli</span>(p=<span class="num">0.7</span>)\n<span class="fn">print</span>(<span class="str">"Bernoulli ornekleri:"</span>, bern.<span class="fn">rvs</span>(size=<span class="num">10</span>))\n\n<span class="cm"># Binom: 20 deneme, p=0.3</span>\nbinom = stats.<span class="fn">binom</span>(n=<span class="num">20</span>, p=<span class="num">0.3</span>)\n<span class="fn">print</span>(<span class="str">"P(X=6)  ="</span>, binom.<span class="fn">pmf</span>(<span class="num">6</span>))   <span class="cm"># k=6 icin OKF</span>\n<span class="fn">print</span>(<span class="str">"P(X<=6) ="</span>, binom.<span class="fn">cdf</span>(<span class="num">6</span>))   <span class="cm"># k=6 icin BDF</span>\n<span class="fn">print</span>(<span class="str">"Ortalama ="</span>, binom.<span class="fn">mean</span>())   <span class="cm"># np = 6.0</span>\n\n<span class="cm"># Gauss: mu=0, sigma=1</span>\nnorm = stats.<span class="fn">norm</span>(loc=<span class="num">0</span>, scale=<span class="num">1</span>)\n<span class="fn">print</span>(<span class="str">"P(X<=1.96) ="</span>, norm.<span class="fn">cdf</span>(<span class="num">1.96</span>))  <span class="cm"># 0.975</span>\n<span class="fn">print</span>(<span class="str">"P(-1.96<=X<=1.96) ="</span>, norm.<span class="fn">cdf</span>(<span class="num">1.96</span>) - norm.<span class="fn">cdf</span>(-<span class="num">1.96</span>))  <span class="cm"># 0.95</span>\n\n<span class="cm"># Kategorik: softmax cikti (sonraki kelime tahmini)</span>\nlogits = np.<span class="fn">array</span>([<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.5</span>, <span class="num">0.1</span>])\nprobs = np.<span class="fn">exp</span>(logits) / np.<span class="fn">sum</span>(np.<span class="fn">exp</span>(logits))  <span class="cm"># softmax</span>\n<span class="fn">print</span>(<span class="str">"Kategorik olasiliklar:"</span>, probs.round(<span class="num">3</span>))\n<span class="fn">print</span>(<span class="str">"Toplam ="</span>, probs.<span class="fn">sum</span>())  <span class="cm"># 1.0</span></code></pre></div>'

/* ============================================================
   BOLUM 10: Özet & Sonraki Adimlar
   ============================================================ */
+ '<h2 class="l-title">10. \u00d6zet & Sonraki Ad\u0131mlar</h2>'

+ '<p class="l-text">Bu ders, t\u00fcm makine \u00f6\u011frenmesinin temelini olu\u015fturan temel olas\u0131l\u0131k kavramlar\u0131n\u0131 i\u015fledi. \u0130\u015fte tam kavram haritan\u0131z:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">\u00d6rneklem Uzay\u0131</div><div class="card-body">T\u00fcm olas\u0131 sonu\u00e7lar\u0131n k\u00fcmesi. NLP\'de s\u00f6zl\u00fck, sonraki kelime tahmini i\u00e7in \u00f6rneklem uzay\u0131d\u0131r.</div><div class="card-formula">S = {t\u00fcm sonu\u00e7lar}</div></div>'
+ '<div class="calc-card"><div class="card-title">Aksiyomlar</div><div class="card-body">Negatif olmama, normalizasyon (1\'e toplam), toplamsall\u0131k. Bu \u00fc\u00e7 kural t\u00fcm olas\u0131l\u0131k teorisini \u00fcretir.</div><div class="card-formula">0\u2264P(A)\u22641, P(S)=1</div></div>'
+ '<div class="calc-card"><div class="card-title">Ko\u015fullu</div><div class="card-body">P(A|B) = P(A\u2229B)/P(B). Kan\u0131ta g\u00f6re inanc\u0131 g\u00fcnceller. Dil modellerinin ve s\u0131n\u0131fland\u0131rman\u0131n temeli.</div><div class="card-formula">P(A|B) = P(A\u2229B)/P(B)</div></div>'
+ '<div class="calc-card"><div class="card-title">Bayes Teoremi</div><div class="card-body">Sonsal = Olabilirlik \u00d7 \u00d6nsel / Kan\u0131t. Ko\u015fullular\u0131 tersine \u00e7evirir. Naive Bayes, Bayesian ML.</div><div class="card-formula">P(A|B) = P(B|A)P(A)/P(B)</div></div>'
+ '<div class="calc-card"><div class="card-title">Ba\u011f\u0131ms\u0131zl\u0131k</div><div class="card-body">P(A\u2229B) = P(A)P(B). Hesaplamay\u0131 basitle\u015ftirir. Naive Bayes ko\u015fullu ba\u011f\u0131ms\u0131zl\u0131k varsayar.</div><div class="card-formula">A \u22a5 B \u21d2 P(A\u2229B)=P(A)P(B)</div></div>'
+ '<div class="calc-card"><div class="card-title">Rastgele De\u011fi\u015fkenler</div><div class="card-body">Sonu\u00e7lar\u0131 say\u0131lara e\u015fler. Kesikli (OKF) vs s\u00fcrekli (OYF). BDF olas\u0131l\u0131\u011f\u0131 biriktirir.</div><div class="card-formula">X: S \u2192 \u211d</div></div>'
+ '<div class="calc-card"><div class="card-title">Beklenti</div><div class="card-body">A\u011f\u0131rl\u0131kl\u0131 ortalama. Kay\u0131p fonksiyonu bir beklentidir. Do\u011frusal: E[X+Y] = E[X]+E[Y].</div><div class="card-formula">E[X] = \u03a3 x\u00b7P(x)</div></div>'
+ '<div class="calc-card"><div class="card-title">Varyans</div><div class="card-body">Ortalama etraf\u0131ndaki yay\u0131l\u0131m. Y\u00fcksek varyans = g\u00fcr\u00fclt\u00fcl\u00fc gradyanlar. Var(X) = E[X\u00b2] - (E[X])\u00b2.</div><div class="card-formula">Var(X) = E[(X-\u03bc)\u00b2]</div></div>'
+ '<div class="calc-card"><div class="card-title">Da\u011f\u0131l\u0131mlar</div><div class="card-body">Adland\u0131r\u0131lm\u0131\u015f aileler: Bernoulli, Binom, Gauss, Kategorik, Uniform. T\u00fcm olas\u0131l\u0131ksal modellerin yap\u0131 ta\u015flar\u0131.</div><div class="card-formula">N(\u03bc, \u03c3\u00b2), Bin(n,p), ...</div></div>'
+ '</div>'

+ '<div class="l-warn"><strong>Sonraki Ders:</strong> Ders 2\'de <strong>\u0130statistik Temelleri</strong>\'ne ge\u00e7iyoruz \u2014 tahmin, hipotez testi, maksimum olabilirlik tahmini (MLE) ve istatistik ile ML e\u011fitimi aras\u0131ndaki ba\u011flant\u0131. MLE tam olarak bir sinir a\u011f\u0131n\u0131 e\u011fitmenin yapt\u0131\u011f\u0131 \u015feydir: g\u00f6zlenen verinin olas\u0131l\u0131\u011f\u0131n\u0131 maksimize eden parametreleri bulmak.</div>'

};