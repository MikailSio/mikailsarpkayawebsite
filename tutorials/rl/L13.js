window.RL_L13 = {

en: `<p class="l-text"><strong>Until now every action you took was discrete: left, right, jump, attack.</strong> But a robot's elbow does not have a "jump" button — it has a joint angle that lives on the real line. This lesson extends RL to continuous action spaces (DDPG, TD3, SAC) and then steps up to systems of many agents acting at once (MARL).</p>
<p class="l-text">Continuous control is the bread-and-butter of robotics, drones, autonomous driving, and physics-based games. Multi-agent RL is where competitive games (StarCraft, Dota, Diplomacy) and cooperative swarms (warehouse robots, traffic) live. By the end you will know which algorithm to reach for and why SAC is the modern default for robot benchmarks.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Why argmax-based Q-learning breaks for real-valued action spaces</li>
<li>Deterministic Policy Gradient and its deep-learning child, DDPG</li>
<li>TD3's three tricks (twin critics, delayed updates, target smoothing) and why they matter</li>
<li>Soft Actor-Critic — maximum-entropy RL and why it is the 2026 default for robots</li>
<li>Multi-agent RL: independent learners, centralized training with decentralized execution (CTDE)</li>
<li>Where MARL meets LLM agents at the 2026 frontier</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Continuous Actions Break Q-Learning</h2>
<p class="l-text">Recall the Q-learning policy: pick the action with the largest Q-value. With four buttons that is a trivial argmax. With a 7-DoF robot arm where each joint torque is a real number in [-1, 1], the action space is the seven-dimensional cube — uncountably infinite. You cannot enumerate, you cannot tabulate, you cannot argmax.</p>
<div class="katex-block">$$a^* = \\arg\\max_{a \\in \\mathcal{A}} Q(s,a) \\quad\\text{breaks when } \\mathcal{A} \\subset \\mathbb{R}^n$$</div>
<p class="l-text">Three things you would lose if you naively discretized a continuous action space:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Curse of dimensionality</div><div class="card-body">10 bins per joint times 7 joints = 10 million discrete actions. Argmax is hopeless.</div></div>
<div class="calc-card"><div class="card-title">Loss of smoothness</div><div class="card-body">Neighbouring torques produce neighbouring outcomes — discretization throws away that structure.</div></div>
<div class="calc-card"><div class="card-title">No gradient through actions</div><div class="card-body">You want to differentiate the critic with respect to the action. Discrete buckets break that.</div></div>
</div>
<p class="l-text">The fix: a policy network that <em>outputs</em> the continuous action, and a critic network that grades it. Backpropagate through the critic into the policy. That is the recipe for the whole DPG / DDPG / TD3 / SAC family.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Deterministic Policy Gradient (DPG)</h2>
<p class="l-text">Silver et al. (2014) proved a beautifully clean result. If your policy is deterministic, <code>a = μ(s; θ)</code>, and you have a critic <code>Q(s, a; ϕ)</code>, then the gradient of expected return with respect to the policy parameters is simply:</p>
<div class="katex-block">$$\\nabla_{\\theta} J(\\theta) \\;=\\; \\mathbb{E}_{s \\sim \\rho^{\\mu}} \\bigl[\\, \\nabla_{a} Q(s,a;\\phi)\\big|_{a=\\mu(s)} \\,\\cdot\\, \\nabla_{\\theta} \\mu(s;\\theta) \\,\\bigr]$$</div>
<p class="l-text">Read this slowly. The chain rule has done all the work. You differentiate the critic with respect to the action (which TensorFlow / PyTorch happily do automatically), evaluate at the action your policy currently produces, and multiply by the Jacobian of the policy. No log-prob, no REINFORCE-style high-variance score function — just a clean deterministic chain.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why deterministic?</div><div class="card-body">A stochastic actor needs the log-trick, which has high variance. Deterministic + critic gradient = low variance.</div></div>
<div class="calc-card"><div class="card-title">Where does exploration come from?</div><div class="card-body">Added externally — additive Gaussian or Ornstein–Uhlenbeck noise on the deterministic output.</div></div>
<div class="calc-card"><div class="card-title">Off-policy bonus</div><div class="card-body">Because the policy is deterministic, you can train Q on any data — replay buffer ready.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DDPG — DPG Meets Deep Learning</h2>
<p class="l-text">Lillicrap et al. (2015) took DPG, added the stabilization tricks from DQN, and produced Deep Deterministic Policy Gradient — the first algorithm to learn continuous control end-to-end from pixels. The recipe is almost embarrassingly mechanical:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Actor μ(s; θ)</div><div class="card-body">Neural net, outputs an action vector. Usually a tanh on top to bound the output.</div></div>
<div class="calc-card"><div class="card-title">Critic Q(s, a; ϕ)</div><div class="card-body">Concatenates state and action, returns a scalar.</div></div>
<div class="calc-card"><div class="card-title">Replay buffer</div><div class="card-body">Off-policy — store (s, a, r, s'), sample minibatches for updates.</div></div>
<div class="calc-card"><div class="card-title">Target networks</div><div class="card-body">Slow-moving copies (Polyak averaging, τ ≈ 0.005) prevent bootstrapping instability.</div></div>
<div class="calc-card"><div class="card-title">Exploration noise</div><div class="card-body">Add noise to μ(s) when acting; clip to action bounds.</div></div>
</div>
<p class="l-text">The Bellman target uses the target networks:</p>
<div class="katex-block">$$y \\;=\\; r \\,+\\, \\gamma \\, Q_{\\phi'}\\!\\bigl(s',\\, \\mu_{\\theta'}(s')\\bigr)$$</div>
<p class="l-text">The critic minimizes <code>(Q(s,a) − y)²</code>; the actor maximizes <code>Q(s, μ(s))</code>. Two losses, two networks, one replay buffer. That is DDPG.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Why Vanilla DDPG Hurts</h2>
<p class="l-text">DDPG works — when it works. Practitioners quickly noticed that it is one of the most fragile deep RL algorithms in the literature. Three diseases show up again and again:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Overestimation bias</div><div class="card-body">Same problem as Q-learning, but worse because the actor exploits the critic's mistakes. Q-values diverge to absurd levels.</div></div>
<div class="calc-card"><div class="card-title">Hyperparameter sensitivity</div><div class="card-body">Switch the learning rate from 1e-3 to 3e-4 and the agent might never learn. Reward scaling matters enormously.</div></div>
<div class="calc-card"><div class="card-title">Brittleness across seeds</div><div class="card-body">Five random seeds, five very different curves — half might never solve the task. Famously documented by Henderson et al. 2017.</div></div>
</div>
<p class="l-text">If you have only ever read papers and never run DDPG, you might think it is a polished method. It is not. TD3 was invented specifically to patch these three holes.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. TD3 — Three Tricks to Tame DDPG</h2>
<p class="l-text">Fujimoto, van Hoof, Meger (2018). Three small modifications to DDPG, each addressing one of the diseases above. Together they turn a fragile algorithm into a serviceable one.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trick 1 — Twin critics</div><div class="card-body">Train two critics Q<sub>1</sub>, Q<sub>2</sub>. In the target, take the minimum: y = r + γ · min(Q<sub>1'</sub>, Q<sub>2'</sub>). Underestimation is much safer than overestimation.</div></div>
<div class="calc-card"><div class="card-title">Trick 2 — Delayed policy updates</div><div class="card-body">Update the critics every step but the actor every 2 steps. A bad critic poisons the actor — wait for it to stabilize.</div></div>
<div class="calc-card"><div class="card-title">Trick 3 — Target policy smoothing</div><div class="card-body">Add clipped noise to the target action: a' = μ'(s') + clip(ε, −c, c). Forces Q to be smooth in actions, prevents exploit of narrow spikes.</div></div>
</div>
<div class="katex-block">$$y \\;=\\; r \\,+\\, \\gamma \\, \\min_{i=1,2}\\, Q_{\\phi_i'}\\!\\bigl(s',\\, \\mu_{\\theta'}(s') + \\tilde{\\epsilon}\\bigr), \\quad \\tilde{\\epsilon} \\sim \\text{clip}(\\mathcal{N}(0,\\sigma), -c, c)$$</div>
<p class="l-text">Same actor-critic architecture, same off-policy training, same replay buffer — but the curves are night and day. TD3 is the minimum bar for "I am serious about continuous control".</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SAC — Soft Actor-Critic and Maximum Entropy</h2>
<p class="l-text">Haarnoja et al. (2018). Where TD3 patches DDPG, SAC re-derives the objective from a different principle: <em>maximum-entropy RL</em>. The agent maximizes reward <strong>plus</strong> an entropy bonus on its own policy.</p>
<div class="katex-block">$$J(\\pi) \\;=\\; \\sum_{t=0}^{T} \\mathbb{E}_{(s_t, a_t) \\sim \\pi}\\Bigl[\\, r(s_t, a_t) \\;+\\; \\alpha \\, \\mathcal{H}\\bigl(\\pi(\\cdot \\mid s_t)\\bigr) \\,\\Bigr]$$</div>
<p class="l-text">The entropy term <code>H(π(·|s))</code> rewards the policy for being uncertain — for keeping options open. That single change buys you three things at once:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Built-in exploration</div><div class="card-body">No external noise schedule. The policy is stochastic and the entropy bonus keeps it that way until reward dominates.</div></div>
<div class="calc-card"><div class="card-title">Robustness</div><div class="card-body">Multimodal optimal policies are representable. SAC handles tasks where several action sequences are equally good.</div></div>
<div class="calc-card"><div class="card-title">Auto-tuned α</div><div class="card-body">The temperature α is learned to match a target entropy. No more hand-tuning the exploration coefficient.</div></div>
</div>
<p class="l-text">SAC also uses twin critics (à la TD3) and Polyak target updates. It is currently the default algorithm for MuJoCo benchmarks (HalfCheetah, Ant, Humanoid) and for sim-to-real robotics. If someone says "we trained a robot policy in 2025", in 70% of cases it was SAC or a SAC variant.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Worked Example — DDPG vs TD3 vs SAC on Pendulum</h2>
<p class="l-text">Pendulum-v1 is the classic continuous-control toy: a one-link pendulum with torque action in [-2, 2], reward shaped on angle and angular velocity. It is too easy to differentiate state-of-the-art methods, but it is perfect for seeing how the family scales.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym
<span class="kw">from</span> stable_baselines3 <span class="kw">import</span> DDPG, TD3, SAC
<span class="kw">from</span> stable_baselines3.common.noise <span class="kw">import</span> NormalActionNoise
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Same environment for all three algorithms</span>
env_id = <span class="str">"Pendulum-v1"</span>
n_actions = gym.<span class="fn">make</span>(env_id).action_space.shape[-<span class="num">1</span>]
noise = <span class="fn">NormalActionNoise</span>(mean=np.<span class="fn">zeros</span>(n_actions), sigma=<span class="num">0.1</span>*np.<span class="fn">ones</span>(n_actions))

<span class="cm"># 1) DDPG — fragile baseline</span>
ddpg = <span class="fn">DDPG</span>(<span class="str">"MlpPolicy"</span>, env_id, action_noise=noise, verbose=<span class="num">0</span>, seed=<span class="num">0</span>)
ddpg.<span class="fn">learn</span>(total_timesteps=<span class="num">30_000</span>)

<span class="cm"># 2) TD3 — twin critics, delayed actor, target smoothing</span>
td3 = <span class="fn">TD3</span>(<span class="str">"MlpPolicy"</span>, env_id, action_noise=noise,
           policy_delay=<span class="num">2</span>, target_policy_noise=<span class="num">0.2</span>, target_noise_clip=<span class="num">0.5</span>,
           verbose=<span class="num">0</span>, seed=<span class="num">0</span>)
td3.<span class="fn">learn</span>(total_timesteps=<span class="num">30_000</span>)

<span class="cm"># 3) SAC — max-entropy, auto-tuned alpha</span>
sac = <span class="fn">SAC</span>(<span class="str">"MlpPolicy"</span>, env_id, ent_coef=<span class="str">"auto"</span>, verbose=<span class="num">0</span>, seed=<span class="num">0</span>)
sac.<span class="fn">learn</span>(total_timesteps=<span class="num">30_000</span>)

<span class="cm"># Pendulum is "solved" at return around -200 (optimal is roughly -120)</span>
<span class="kw">for</span> name, model <span class="kw">in</span> [(<span class="str">"DDPG"</span>, ddpg), (<span class="str">"TD3"</span>, td3), (<span class="str">"SAC"</span>, sac)]:
    eval_env = gym.<span class="fn">make</span>(env_id)
    returns = []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
        obs, _ = eval_env.<span class="fn">reset</span>(); done = <span class="kw">False</span>; G = <span class="num">0.0</span>
        <span class="kw">while</span> <span class="kw">not</span> done:
            a, _ = model.<span class="fn">predict</span>(obs, deterministic=<span class="kw">True</span>)
            obs, r, term, trunc, _ = eval_env.<span class="fn">step</span>(a); G += r; done = term <span class="kw">or</span> trunc
        returns.<span class="fn">append</span>(G)
    <span class="fn">print</span>(f<span class="str">"{name}: mean return = {np.mean(returns):.1f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">SB3 + gymnasium are blocked in Pyodide. Browser equivalent: a hand-rolled DDPG-style update on a 1D toy where a = μ(s) is a single weight and the critic is a quadratic — enough to see the chain-rule gradient flow through.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
# Toy: state s in [-1,1], optimal action a* = 0.5*s, reward = -(a - 0.5*s)**2
theta = 0.0           # actor parameter: a = theta * s
phi = np.array([0.0, 0.0, 0.0])  # critic Q(s,a) ~ phi0 + phi1*s + phi2*a
lr_a, lr_c = 0.02, 0.05
for step in range(2000):
    s = float(rng.uniform(-1, 1))
    a = theta * s + 0.1 * rng.standard_normal()   # explore
    r = -(a - 0.5 * s) ** 2
    feat = np.array([1.0, s, a])
    td = r - phi @ feat                           # 1-step (no bootstrap here, episodic)
    phi += lr_c * td * feat                       # critic update
    # actor update: dQ/da = phi[2]; chain-rule into theta via da/dtheta = s
    grad_a = phi[2]
    theta += lr_a * grad_a * s
print(f"learned theta = {theta:.3f}, target = 0.500")
print(f"critic phi = {np.round(phi, 3)}")</code></pre></div>
</div>
<p class="l-text">Three things to watch when you run the full version: DDPG often shows wild variance and may stall around return -800. TD3 climbs more smoothly and lands near -200 reliably. SAC typically reaches near-optimal (around -150) the fastest and is the calmest of the three. The Plotly curve below is a stylized version of what you should expect.</p>
<div id="plot-rl13-conv-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Multi-Agent RL — The Setting</h2>
<p class="l-text">So far the world contained one agent. Real games and real economies contain many. In Multi-Agent RL we have N agents, each with its own observation o<sub>i</sub>, its own action a<sub>i</sub>, and some reward structure. The hardest part is not the algorithms — it is naming what kind of game you are in.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cooperative</div><div class="card-body">All agents share one reward. Examples: warehouse robots coordinating, multi-arm robot manipulation, traffic-light control.</div></div>
<div class="calc-card"><div class="card-title">Competitive (zero-sum)</div><div class="card-body">One agent's gain is another's loss. Examples: chess, Go, two-player poker, AlphaStar self-play.</div></div>
<div class="calc-card"><div class="card-title">Mixed (general-sum)</div><div class="card-body">Some shared, some opposing interests. Examples: Diplomacy, mixed-motive driving, Dota 5v5.</div></div>
</div>
<p class="l-text">Why is this hard? Because from any single agent's point of view, the environment is no longer stationary. Every time another agent updates its policy, the transition dynamics seen by you change. Convergence guarantees for single-agent RL evaporate.</p>
<div class="katex-block">$$\\text{For agent } i:\\quad P_i(s' \\mid s, a_i) \\;=\\; \\sum_{a_{-i}} P(s' \\mid s, a_i, a_{-i}) \\,\\prod_{j\\neq i}\\pi_j(a_j \\mid s)$$</div>
<p class="l-text">The right-hand side depends on every <em>other</em> agent's current policy. As they learn, your effective transition function drifts. This single fact drives most of MARL's complexity.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Independent Learners — The Naive Baseline</h2>
<p class="l-text">The simplest MARL algorithm: give every agent its own DQN or PPO and let them all train at the same time, treating other agents as part of the environment. This is called Independent Q-Learning (IQL) or Independent PPO (IPPO).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pros</div><div class="card-body">Trivial to implement. Scales linearly. No new theory required. Surprisingly strong baseline on many cooperative tasks.</div></div>
<div class="calc-card"><div class="card-title">Cons</div><div class="card-body">Non-stationarity (each agent's world is moving). Credit assignment broken (was reward due to me or my teammate?). Can cycle in zero-sum games.</div></div>
<div class="calc-card"><div class="card-title">When it works</div><div class="card-body">Cooperative tasks with mostly local rewards, e.g. multi-agent particle environments, simple traffic, small teams.</div></div>
<div class="calc-card"><div class="card-title">When it fails</div><div class="card-body">Tight coordination required (StarCraft micro, Hanabi). Adversarial games where opponents are themselves learning.</div></div>
</div>
<p class="l-text">IPPO in particular was for years considered weak — and then the surprise 2021 result (de Witt et al.) showed it is competitive with sophisticated MARL methods on StarCraft II micromanagement. The lesson: try the trivial baseline first.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. CTDE — Centralized Training, Decentralized Execution</h2>
<p class="l-text">The dominant MARL paradigm. During <em>training</em> the learner has access to every agent's observation and action — godlike, central view. At <em>execution</em> time each agent sees only its own observation and runs its own policy network. Best of both worlds: stable learning from global signal, deployable as truly decentralized agents.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MADDPG (2017)</div><div class="card-body">Lowe et al. Each agent has its own actor μ<sub>i</sub>(o<sub>i</sub>) but the critic Q<sub>i</sub>(s, a<sub>1</sub>,...,a<sub>N</sub>) sees everyone. Solves cooperative + competitive particle tasks.</div></div>
<div class="calc-card"><div class="card-title">QMIX (2018)</div><div class="card-body">Cooperative only. Per-agent Q<sub>i</sub>(o<sub>i</sub>, a<sub>i</sub>) combined via a monotonic mixing network into a team Q<sub>tot</sub>. Workhorse for StarCraft II micro.</div></div>
<div class="calc-card"><div class="card-title">MAPPO (2021)</div><div class="card-body">PPO with a centralized critic that sees the global state. Simple, very strong on SMAC, Hanabi, MPE.</div></div>
<div class="calc-card"><div class="card-title">Counterfactual MA (COMA)</div><div class="card-body">Counterfactual baseline answers "what if I had done something else?" — clean credit assignment.</div></div>
</div>
<div class="katex-block">$$\\text{MADDPG actor gradient:}\\quad \\nabla_{\\theta_i} J \\;=\\; \\mathbb{E}\\bigl[\\, \\nabla_{\\theta_i} \\mu_i(o_i) \\,\\cdot\\, \\nabla_{a_i} Q_i^{\\,\\mu}(s, a_1,\\ldots,a_N) \\big|_{a_i=\\mu_i(o_i)} \\,\\bigr]$$</div>
<p class="l-text">Same chain rule you saw in DPG — only now the critic also sees what everyone else is doing. That extra information is what makes the gradient less noisy and lets MADDPG learn coordinated behaviour.</p>
<p class="l-text">A minimal cooperative experiment: two agents on a 2D plane, each must reach its own goal but the team reward is given only when both succeed in the same episode. IPPO solves it sometimes; MAPPO solves it almost always. The curve below sketches the typical gap.</p>
<div id="plot-rl13-marl-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. 2026 Frontier — Where MARL Is Right Now</h2>
<p class="l-text">Multi-agent learning is one of the most active research areas in 2026, partly because it sits at the intersection of RL, game theory, and LLM agents. A quick tour:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Emergent communication</div><div class="card-body">OpenAI hide-and-seek (2019) — agents invented tool use and communication signals without being told to. Still a live research thread.</div></div>
<div class="calc-card"><div class="card-title">Diplomacy &amp; CICERO</div><div class="card-body">Meta 2022. A mixed-motive game requiring natural-language negotiation. Combines an LLM dialogue module with classical planning + RL.</div></div>
<div class="calc-card"><div class="card-title">Zero-shot coordination</div><div class="card-body">Train a policy that cooperates with a brand-new partner it never met — crucial for human–AI teams. Hanabi is the canonical benchmark.</div></div>
<div class="calc-card"><div class="card-title">LLM-as-policy multi-agent</div><div class="card-body">Several LLM agents (ReAct, AutoGen, CrewAI) communicating in natural language. Direct bridge between this lesson and the agent track.</div></div>
<div class="calc-card"><div class="card-title">Self-play scaling</div><div class="card-body">AlphaStar, OpenAI Five — population-based training where the league of past versions becomes the curriculum.</div></div>
<div class="calc-card"><div class="card-title">Mechanism design + RL</div><div class="card-body">Train an agent that also designs the rules — emerging area at the intersection with auction theory and economics.</div></div>
</div>
<div class="think-box"><div class="think-label">TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Continuous actions break argmax-based Q-learning — you need an actor that outputs the action and a critic that grades it.<br><strong>2.</strong> DPG gives the deterministic chain-rule gradient; DDPG = DPG + DQN tricks (replay, targets, noise).<br><strong>3.</strong> DDPG is fragile (overestimation, hyperparam sensitivity). TD3 patches it with twin critics, delayed updates, and target smoothing.<br><strong>4.</strong> SAC adds an entropy bonus and auto-tunes the temperature — the 2026 default for robotics and MuJoCo.<br><strong>5.</strong> Multi-agent RL is hard mainly because the world becomes non-stationary from any single agent's view.<br><strong>6.</strong> Independent learners are a stronger baseline than people used to think; CTDE (MADDPG, QMIX, MAPPO) is the dominant paradigm for serious work.<br><strong>7.</strong> The frontier in 2026 ties MARL to LLM agents — emergent communication, Diplomacy/CICERO, AutoGen-style negotiation.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var ep = Array.from({length:60}, function(_,i){return (i+1)*500;});
  function curve(start, slope, ceil, jitter){
    return ep.map(function(_,i){ return Math.min(ceil, start + slope*i) + (Math.random()-0.5)*jitter; });
  }
  var ddpg = curve(-1400, 18, -350, 90);
  var td3  = curve(-1400, 22, -200, 60);
  var sac  = curve(-1400, 28, -150, 45);
  var data = [
    {x:ep, y:ddpg, name:'DDPG',  type:'scatter', mode:'lines', line:{color:'#e07a5f', width:2}},
    {x:ep, y:td3,  name:'TD3',   type:'scatter', mode:'lines', line:{color:'#81b29a', width:2}},
    {x:ep, y:sac,  name:'SAC',   type:'scatter', mode:'lines', line:{color:T.accent,  width:2.4}}
  ];
  var layout = {
    title:'Pendulum-v1 — DDPG vs TD3 vs SAC (stylized)',
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:T.text},
    xaxis:{title:'Env steps', gridcolor:T.grid},
    yaxis:{title:'Mean return', gridcolor:T.grid},
    legend:{orientation:'h', y:-0.18},
    margin:{t:60,r:30,b:60,l:60}
  };
  ['plot-rl13-conv-en','plot-rl13-conv-tr'].forEach(function(id){
    var el = document.getElementById(id);
    if (el && window.Plotly) Plotly.newPlot(id, data, layout, {displayModeBar:false});
  });

  var ep2 = Array.from({length:50}, function(_,i){return (i+1)*200;});
  function marlcurve(slope, ceil, jitter, offset){
    return ep2.map(function(_,i){ return Math.min(ceil, offset + slope*i) + (Math.random()-0.5)*jitter; });
  }
  var ippo  = marlcurve(0.012, 0.55, 0.08, 0.05);
  var mappo = marlcurve(0.020, 0.92, 0.05, 0.05);
  var data2 = [
    {x:ep2, y:ippo,  name:'IPPO (independent)', type:'scatter', mode:'lines', line:{color:'#e07a5f', width:2}},
    {x:ep2, y:mappo, name:'MAPPO (CTDE)',       type:'scatter', mode:'lines', line:{color:T.accent,  width:2.4}}
  ];
  var layout2 = {
    title:'Cooperative reach task — IPPO vs MAPPO success rate',
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:T.text},
    xaxis:{title:'Episodes', gridcolor:T.grid},
    yaxis:{title:'Joint success rate', gridcolor:T.grid, range:[0,1]},
    legend:{orientation:'h', y:-0.18},
    margin:{t:60,r:30,b:60,l:60}
  };
  ['plot-rl13-marl-en','plot-rl13-marl-tr'].forEach(function(id){
    var el = document.getElementById(id);
    if (el && window.Plotly) Plotly.newPlot(id, data2, layout2, {displayModeBar:false});
  });
}, 250);
</script>`,

tr: `<p class="l-text"><strong>Şimdiye kadar yaptığın her eylem ayrıktı: sol, sağ, zıpla, saldır.</strong> Ama bir robotun dirseğinde "zıpla" düğmesi yok — gerçek sayı ekseni üzerinde yaşayan bir eklem açısı var. Bu ders RL'i sürekli eylem uzaylarına (DDPG, TD3, SAC) genişletir, ardından aynı anda eyleyen pek çok ajandan oluşan sistemlere (MARL) geçer.</p>
<p class="l-text">Sürekli kontrol; robotik, drone, otonom sürüş ve fizik tabanlı oyunların temel ekmeğidir. Çok ajanlı RL ise rekabetçi oyunların (StarCraft, Dota, Diplomacy) ve işbirlikçi sürülerin (depo robotları, trafik) bulunduğu yerdir. Dersin sonunda hangi algoritmaya uzanacağını ve robot kıyaslarında SAC'in neden 2026 standardı olduğunu bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Argmax tabanlı Q-öğrenmenin sürekli eylem uzayında neden kırıldığını</li>
<li>Deterministik Politika Gradyanını ve onun derin öğrenme çocuğu DDPG'yi</li>
<li>TD3'ün üç hilesini (ikiz eleştirmen, gecikmeli güncelleme, hedef yumuşatma) ve neden işe yaradıklarını</li>
<li>Soft Actor-Critic'i — maksimum-entropi RL'i ve neden 2026 robotik standardı olduğunu</li>
<li>Çok ajanlı RL: bağımsız öğreniciler, merkezi eğitim ve merkezsiz yürütme (CTDE)</li>
<li>MARL'ın LLM ajanlarıyla 2026'da nerede kesiştiğini</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Sürekli Eylemler Q-Öğrenmeyi Neden Kırar?</h2>
<p class="l-text">Q-öğrenme politikasını hatırla: en büyük Q değerine sahip eylemi seç. Dört düğmeyle bu önemsiz bir argmax'tır. Her eklem torku [-1, 1] aralığında bir gerçek sayı olan 7 serbestlik dereceli bir robot kolunda ise eylem uzayı yedi boyutlu küptür — sayılamaz sonsuzlukta. Sıralayamazsın, tabloya dökemezsin, argmax alamazsın.</p>
<div class="katex-block">$$a^* = \\arg\\max_{a \\in \\mathcal{A}} Q(s,a) \\quad\\text{breaks when } \\mathcal{A} \\subset \\mathbb{R}^n$$</div>
<p class="l-text">Sürekli bir eylem uzayını naifçe ayrıklaştırsan kaybedeceğin üç şey:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Boyutluluk laneti</div><div class="card-body">Eklem başına 10 kova çarpı 7 eklem = 10 milyon ayrık eylem. Argmax umutsuz.</div></div>
<div class="calc-card"><div class="card-title">Düzgünlüğü kaybetme</div><div class="card-body">Komşu torklar komşu sonuçlar üretir — ayrıklaştırma bu yapıyı çöpe atar.</div></div>
<div class="calc-card"><div class="card-title">Eylem üzerinden gradyan yok</div><div class="card-body">Eleştirmeni eylem değişkenine göre türevlemek istersin. Ayrık kovalar bunu yok eder.</div></div>
</div>
<p class="l-text">Çözüm: sürekli eylemi <em>çıktı veren</em> bir politika ağı ve onu notlandıran bir eleştirmen ağı. Eleştirmenden politikaya geri yayıl. Bütün DPG / DDPG / TD3 / SAC ailesinin tarifi budur.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Deterministik Politika Gradyanı (DPG)</h2>
<p class="l-text">Silver ve arkadaşları (2014) son derece temiz bir sonuç kanıtladı. Politikan deterministikse, <code>a = μ(s; θ)</code>, ve elinde bir eleştirmen <code>Q(s, a; ϕ)</code> varsa, beklenen getirinin politika parametrelerine göre gradyanı tam olarak şudur:</p>
<div class="katex-block">$$\\nabla_{\\theta} J(\\theta) \\;=\\; \\mathbb{E}_{s \\sim \\rho^{\\mu}} \\bigl[\\, \\nabla_{a} Q(s,a;\\phi)\\big|_{a=\\mu(s)} \\,\\cdot\\, \\nabla_{\\theta} \\mu(s;\\theta) \\,\\bigr]$$</div>
<p class="l-text">Bunu yavaş oku. Tüm işi zincir kuralı yapmış. Eleştirmeni eyleme göre türevliyorsun (PyTorch / TensorFlow bunu otomatik yapar), politikanın o anki ürettiği eylemde değerlendiriyorsun ve politikanın Jacobian'ı ile çarpıyorsun. Log-olasılık yok, REINFORCE tarzı yüksek varyanslı skor fonksiyonu yok — sadece temiz bir deterministik zincir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden deterministik?</div><div class="card-body">Stokastik aktör log-hilesine ihtiyaç duyar, varyansı yüksektir. Deterministik + eleştirmen gradyanı = düşük varyans.</div></div>
<div class="calc-card"><div class="card-title">Keşif nereden gelir?</div><div class="card-body">Dışarıdan eklenir — deterministik çıktının üstüne Gaussian veya Ornstein–Uhlenbeck gürültüsü.</div></div>
<div class="calc-card"><div class="card-title">Off-policy ikramiyesi</div><div class="card-body">Politika deterministik olduğu için Q'yu herhangi bir veriyle eğitebilirsin — tekrar tamponuna hazır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DDPG — DPG Derin Öğrenmeyle Buluşunca</h2>
<p class="l-text">Lillicrap ve arkadaşları (2015) DPG'yi alıp DQN'in stabilizasyon hilelerini ekledi ve Deep Deterministic Policy Gradient'i üretti — pikselden uçtan uca sürekli kontrol öğrenen ilk algoritma. Tarif neredeyse mahcup edici şekilde mekaniktir:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aktör μ(s; θ)</div><div class="card-body">Sinir ağı, bir eylem vektörü verir. Genelde üstte tanh ile sınırlı tutulur.</div></div>
<div class="calc-card"><div class="card-title">Eleştirmen Q(s, a; ϕ)</div><div class="card-body">Durum ile eylemi birleştirir, skaler döndürür.</div></div>
<div class="calc-card"><div class="card-title">Tekrar tamponu</div><div class="card-body">Off-policy — (s, a, r, s') sakla, güncelleme için mini-toplu çek.</div></div>
<div class="calc-card"><div class="card-title">Hedef ağlar</div><div class="card-body">Yavaş hareketli kopyalar (Polyak ortalaması, τ ≈ 0.005) bootstrap kararsızlığını önler.</div></div>
<div class="calc-card"><div class="card-title">Keşif gürültüsü</div><div class="card-body">Eylem üretirken μ(s) üstüne gürültü ekle; eylem sınırlarına kırp.</div></div>
</div>
<p class="l-text">Bellman hedefi hedef ağları kullanır:</p>
<div class="katex-block">$$y \\;=\\; r \\,+\\, \\gamma \\, Q_{\\phi'}\\!\\bigl(s',\\, \\mu_{\\theta'}(s')\\bigr)$$</div>
<p class="l-text">Eleştirmen <code>(Q(s,a) − y)²</code>'yi küçültür; aktör <code>Q(s, μ(s))</code>'yi büyütür. İki kayıp, iki ağ, bir tekrar tamponu. DDPG bundan ibaret.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Saf DDPG Neden Acı Verir?</h2>
<p class="l-text">DDPG çalışır — çalıştığında. Uygulamacılar onun literatürdeki en kırılgan derin RL algoritmalarından biri olduğunu çabuk fark etti. Üç hastalık tekrar tekrar ortaya çıkar:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşırı tahmin sapması</div><div class="card-body">Q-öğrenmedeki ile aynı problem ama daha kötü, çünkü aktör eleştirmenin hatalarını sömürür. Q değerleri saçma seviyelere ıraksar.</div></div>
<div class="calc-card"><div class="card-title">Hiperparametre hassasiyeti</div><div class="card-body">Öğrenme oranını 1e-3'ten 3e-4'e çevir, ajan asla öğrenmeyebilir. Ödül ölçeklemesi devasa fark yaratır.</div></div>
<div class="calc-card"><div class="card-title">Tohumlar arası kırılganlık</div><div class="card-body">Beş rastgele tohum, beş çok farklı eğri — yarısı görevi hiç çözmeyebilir. Henderson ve arkadaşları 2017'de meşhur şekilde belgeledi.</div></div>
</div>
<p class="l-text">Eğer sadece makale okuduysan ve DDPG'yi hiç çalıştırmadıysan onu cilalı bir yöntem sanabilirsin. Değil. TD3 tam da bu üç deliği yamamak için icat edildi.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. TD3 — DDPG'yi Evcilleştiren Üç Hile</h2>
<p class="l-text">Fujimoto, van Hoof, Meger (2018). DDPG'ye üç küçük değişiklik, her biri yukarıdaki hastalıklardan birini tedavi eder. Birlikte kırılgan bir algoritmayı kullanışlı bir şeye dönüştürürler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hile 1 — İkiz eleştirmenler</div><div class="card-body">İki eleştirmen Q<sub>1</sub>, Q<sub>2</sub> eğit. Hedefte minimumu al: y = r + γ · min(Q<sub>1'</sub>, Q<sub>2'</sub>). Düşük tahmin, yüksek tahminden çok daha güvenlidir.</div></div>
<div class="calc-card"><div class="card-title">Hile 2 — Gecikmeli politika güncellemesi</div><div class="card-body">Eleştirmenleri her adımda güncelle, aktörü her 2 adımda bir. Kötü bir eleştirmen aktörü zehirler — kararlılığı bekle.</div></div>
<div class="calc-card"><div class="card-title">Hile 3 — Hedef politika yumuşatma</div><div class="card-body">Hedef eyleme kırpılmış gürültü ekle: a' = μ'(s') + clip(ε, −c, c). Q'yu eylem üzerinde düzgün olmaya zorlar, dar pikleri sömürmeyi önler.</div></div>
</div>
<div class="katex-block">$$y \\;=\\; r \\,+\\, \\gamma \\, \\min_{i=1,2}\\, Q_{\\phi_i'}\\!\\bigl(s',\\, \\mu_{\\theta'}(s') + \\tilde{\\epsilon}\\bigr), \\quad \\tilde{\\epsilon} \\sim \\text{clip}(\\mathcal{N}(0,\\sigma), -c, c)$$</div>
<p class="l-text">Aynı aktör-eleştirmen mimarisi, aynı off-policy eğitim, aynı tekrar tamponu — ama eğriler gece ile gündüz gibi farklı. "Sürekli kontrole ciddi yaklaşıyorum" demek için TD3 alt sınırdır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SAC — Soft Actor-Critic ve Maksimum Entropi</h2>
<p class="l-text">Haarnoja ve arkadaşları (2018). TD3 DDPG'yi yamarken, SAC hedef fonksiyonunu farklı bir ilkeyle yeniden türetir: <em>maksimum-entropi RL</em>. Ajan ödülü <strong>artı</strong> kendi politikası üzerindeki bir entropi bonusunu en büyükler.</p>
<div class="katex-block">$$J(\\pi) \\;=\\; \\sum_{t=0}^{T} \\mathbb{E}_{(s_t, a_t) \\sim \\pi}\\Bigl[\\, r(s_t, a_t) \\;+\\; \\alpha \\, \\mathcal{H}\\bigl(\\pi(\\cdot \\mid s_t)\\bigr) \\,\\Bigr]$$</div>
<p class="l-text">Entropi terimi <code>H(π(·|s))</code> politikayı belirsiz olduğu için — seçenekleri açık tuttuğu için — ödüllendirir. Bu tek değişiklik sana aynı anda üç şey kazandırır:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yerleşik keşif</div><div class="card-body">Harici gürültü programı yok. Politika stokastiktir ve entropi bonusu ödül baskın hale gelene kadar onu öyle tutar.</div></div>
<div class="calc-card"><div class="card-title">Sağlamlık</div><div class="card-body">Çok modlu optimal politikalar temsil edilebilir. SAC, birkaç eylem dizisinin eşit derecede iyi olduğu görevlerde başarılıdır.</div></div>
<div class="calc-card"><div class="card-title">Otomatik α ayarı</div><div class="card-body">Sıcaklık α, bir hedef entropiyi tutturmak için öğrenilir. Keşif katsayısını elle ayarlamak yok.</div></div>
</div>
<p class="l-text">SAC ayrıca ikiz eleştirmen (TD3 stilinde) ve Polyak hedef güncellemesi kullanır. Şu anda MuJoCo kıyasları (HalfCheetah, Ant, Humanoid) ve sim-to-real robotik için standart algoritmadır. Biri "2025'te bir robot politikası eğittik" derse vakaların yüzde 70'inde söz konusu SAC ya da bir SAC varyantıydı.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. İşlenmiş Örnek — Pendulum'da DDPG vs TD3 vs SAC</h2>
<p class="l-text">Pendulum-v1, klasik sürekli kontrol oyuncağıdır: tek bağlantılı bir sarkaç, [-2, 2] aralığında tork eylemi, açı ve açısal hız üzerinde şekillendirilmiş ödül. SOTA yöntemleri ayırt etmek için fazla kolay, ama ailenin nasıl ölçeklendiğini görmek için kusursuz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym
<span class="kw">from</span> stable_baselines3 <span class="kw">import</span> DDPG, TD3, SAC
<span class="kw">from</span> stable_baselines3.common.noise <span class="kw">import</span> NormalActionNoise
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Uc algoritma icin ayni ortam</span>
env_id = <span class="str">"Pendulum-v1"</span>
n_actions = gym.<span class="fn">make</span>(env_id).action_space.shape[-<span class="num">1</span>]
noise = <span class="fn">NormalActionNoise</span>(mean=np.<span class="fn">zeros</span>(n_actions), sigma=<span class="num">0.1</span>*np.<span class="fn">ones</span>(n_actions))

<span class="cm"># 1) DDPG — kirilgan taban</span>
ddpg = <span class="fn">DDPG</span>(<span class="str">"MlpPolicy"</span>, env_id, action_noise=noise, verbose=<span class="num">0</span>, seed=<span class="num">0</span>)
ddpg.<span class="fn">learn</span>(total_timesteps=<span class="num">30_000</span>)

<span class="cm"># 2) TD3 — ikiz elestirmen, gecikmeli aktor, hedef yumusatma</span>
td3 = <span class="fn">TD3</span>(<span class="str">"MlpPolicy"</span>, env_id, action_noise=noise,
           policy_delay=<span class="num">2</span>, target_policy_noise=<span class="num">0.2</span>, target_noise_clip=<span class="num">0.5</span>,
           verbose=<span class="num">0</span>, seed=<span class="num">0</span>)
td3.<span class="fn">learn</span>(total_timesteps=<span class="num">30_000</span>)

<span class="cm"># 3) SAC — maks entropi, otomatik alpha</span>
sac = <span class="fn">SAC</span>(<span class="str">"MlpPolicy"</span>, env_id, ent_coef=<span class="str">"auto"</span>, verbose=<span class="num">0</span>, seed=<span class="num">0</span>)
sac.<span class="fn">learn</span>(total_timesteps=<span class="num">30_000</span>)

<span class="cm"># Pendulum yaklasik -200 getiride "cozulmus" sayilir (optimal ~ -120)</span>
<span class="kw">for</span> name, model <span class="kw">in</span> [(<span class="str">"DDPG"</span>, ddpg), (<span class="str">"TD3"</span>, td3), (<span class="str">"SAC"</span>, sac)]:
    eval_env = gym.<span class="fn">make</span>(env_id)
    returns = []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
        obs, _ = eval_env.<span class="fn">reset</span>(); done = <span class="kw">False</span>; G = <span class="num">0.0</span>
        <span class="kw">while</span> <span class="kw">not</span> done:
            a, _ = model.<span class="fn">predict</span>(obs, deterministic=<span class="kw">True</span>)
            obs, r, term, trunc, _ = eval_env.<span class="fn">step</span>(a); G += r; done = term <span class="kw">or</span> trunc
        returns.<span class="fn">append</span>(G)
    <span class="fn">print</span>(f<span class="str">"{name}: ortalama getiri = {np.mean(returns):.1f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">SB3 + gymnasium Pyodide'de bloklu. Tarayıcı eşdeğeri: a = μ(s) tek bir ağırlık, eleştirmen ise quadratik olan 1B oyuncak üzerinde elle yazılmış DDPG tarzı güncelleme — zincir kuralı gradyanının nasıl aktığını görmek için yeterli.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
# Oyuncak: s in [-1,1], optimal eylem a* = 0.5*s, odul = -(a - 0.5*s)**2
theta = 0.0           # aktor parametresi: a = theta * s
phi = np.array([0.0, 0.0, 0.0])  # elestirmen Q(s,a) ~ phi0 + phi1*s + phi2*a
lr_a, lr_c = 0.02, 0.05
for step in range(2000):
    s = float(rng.uniform(-1, 1))
    a = theta * s + 0.1 * rng.standard_normal()   # kesif
    r = -(a - 0.5 * s) ** 2
    feat = np.array([1.0, s, a])
    td = r - phi @ feat                           # 1-adim (bootstrap yok, epizodik)
    phi += lr_c * td * feat                       # elestirmen guncelleme
    # aktor: dQ/da = phi[2]; zincirle theta'ya, da/dtheta = s
    grad_a = phi[2]
    theta += lr_a * grad_a * s
print(f"ogrenilen theta = {theta:.3f}, hedef = 0.500")
print(f"elestirmen phi = {np.round(phi, 3)}")</code></pre></div>
</div>
<p class="l-text">Tam sürümü çalıştırırken izlemen gereken üç şey: DDPG çoğunlukla yaban varyans gösterir ve -800 civarında takılabilir. TD3 daha pürüzsüz tırmanır ve güvenilir şekilde -200 dolayına iner. SAC tipik olarak en hızlı şekilde optimal yakınına (yaklaşık -150) ulaşır ve üçünün en sakinidir. Aşağıdaki Plotly eğrisi, beklenmesi gerekenin stilize bir versiyonudur.</p>
<div id="plot-rl13-conv-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Çok Ajanlı RL — Ortam</h2>
<p class="l-text">Şimdiye kadar dünya tek bir ajan içeriyordu. Gerçek oyunlar ve gerçek ekonomiler birçoğunu içerir. Çok Ajanlı RL'de N ajanımız var, her birinin kendi gözlemi o<sub>i</sub>, kendi eylemi a<sub>i</sub> ve bir ödül yapısı. En zor kısım algoritmalar değildir — hangi tip oyunda olduğunu adlandırmaktır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">İşbirlikçi</div><div class="card-body">Tüm ajanlar tek bir ödülü paylaşır. Örnek: koordine olan depo robotları, çok kollu robot manipülasyonu, trafik ışığı kontrolü.</div></div>
<div class="calc-card"><div class="card-title">Rekabetçi (sıfır-toplam)</div><div class="card-body">Birinin kazancı diğerinin kaybıdır. Örnek: satranç, Go, iki kişilik poker, AlphaStar kendi-eşleşmesi.</div></div>
<div class="calc-card"><div class="card-title">Karışık (genel-toplam)</div><div class="card-body">Bazı çıkarlar ortak, bazıları çelişen. Örnek: Diplomacy, karışık güdülü sürüş, Dota 5'e 5.</div></div>
</div>
<p class="l-text">Bu neden zor? Çünkü tek bir ajanın bakış açısından artık ortam durağan değildir. Başka bir ajan politikasını her güncellediğinde senin gördüğün geçiş dinamikleri değişir. Tek ajanlı RL'nin yakınsama garantileri buharlaşır.</p>
<div class="katex-block">$$\\text{For agent } i:\\quad P_i(s' \\mid s, a_i) \\;=\\; \\sum_{a_{-i}} P(s' \\mid s, a_i, a_{-i}) \\,\\prod_{j\\neq i}\\pi_j(a_j \\mid s)$$</div>
<p class="l-text">Sağ taraf <em>diğer</em> her ajanın o anki politikasına bağlıdır. Onlar öğrendikçe senin etkin geçiş fonksiyonun kayar. MARL'ın karmaşıklığının çoğu bu tek olgudan doğar.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Bağımsız Öğreniciler — Naif Taban</h2>
<p class="l-text">En basit MARL algoritması: her ajana kendi DQN'ini ya da PPO'sunu ver, hepsi aynı anda eğitsin, diğer ajanları ortamın bir parçası gibi gör. Buna Independent Q-Learning (IQL) ya da Independent PPO (IPPO) denir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Artıları</div><div class="card-body">Uygulaması basit. Lineer ölçeklenir. Yeni teori gerektirmez. Birçok işbirlikçi görevde şaşırtıcı şekilde güçlü bir taban.</div></div>
<div class="calc-card"><div class="card-title">Eksileri</div><div class="card-body">Durağansızlık (her ajanın dünyası kayıyor). Kredi atama bozulur (ödül bana mı yoksa takım arkadaşıma mı yazılmalı?). Sıfır-toplam oyunlarda çevrime girebilir.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman işe yarar?</div><div class="card-body">Çoğunlukla yerel ödüllü işbirlikçi görevler, örn. çok ajanlı parçacık ortamları, basit trafik, küçük takımlar.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman başarısız olur?</div><div class="card-body">Sıkı koordinasyon gerektiğinde (StarCraft mikro, Hanabi). Rakiplerin kendisi de öğrenen rekabetçi oyunlarda.</div></div>
</div>
<p class="l-text">Özellikle IPPO yıllarca zayıf sayıldı — ardından 2021'in sürpriz sonucu (de Witt ve ark.) onun StarCraft II mikro yönetiminde gelişmiş MARL yöntemleriyle rekabet edebildiğini gösterdi. Ders: önce önemsiz tabanı dene.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. CTDE — Merkezi Eğitim, Merkezsiz Yürütme</h2>
<p class="l-text">Baskın MARL paradigması. <em>Eğitim</em> sırasında öğrenicinin her ajanın gözlemine ve eylemine erişimi vardır — tanrısal, merkezi bakış. <em>Yürütme</em> sırasında her ajan yalnızca kendi gözlemini görür ve kendi politika ağını çalıştırır. İki dünyanın en iyisi: küresel sinyalden kararlı öğrenme, gerçekten merkezsiz olarak konuşlandırılabilir ajanlar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MADDPG (2017)</div><div class="card-body">Lowe ve ark. Her ajanın kendi aktörü μ<sub>i</sub>(o<sub>i</sub>) var ama eleştirmen Q<sub>i</sub>(s, a<sub>1</sub>,...,a<sub>N</sub>) herkesi görür. İşbirlikçi + rekabetçi parçacık görevlerini çözer.</div></div>
<div class="calc-card"><div class="card-title">QMIX (2018)</div><div class="card-body">Sadece işbirlikçi. Ajan başına Q<sub>i</sub>(o<sub>i</sub>, a<sub>i</sub>) tekdüze bir karıştırma ağı üzerinden takım Q<sub>tot</sub>'una birleştirilir. StarCraft II mikrosunda iş atı.</div></div>
<div class="calc-card"><div class="card-title">MAPPO (2021)</div><div class="card-body">Küresel durumu gören merkezi eleştirmenli PPO. Basit, SMAC, Hanabi ve MPE üzerinde çok güçlü.</div></div>
<div class="calc-card"><div class="card-title">Counterfactual MA (COMA)</div><div class="card-body">"Başka bir şey yapsaydım ne olurdu?" karşı-olgusal tabanı net kredi atama sağlar.</div></div>
</div>
<div class="katex-block">$$\\text{MADDPG actor gradient:}\\quad \\nabla_{\\theta_i} J \\;=\\; \\mathbb{E}\\bigl[\\, \\nabla_{\\theta_i} \\mu_i(o_i) \\,\\cdot\\, \\nabla_{a_i} Q_i^{\\,\\mu}(s, a_1,\\ldots,a_N) \\big|_{a_i=\\mu_i(o_i)} \\,\\bigr]$$</div>
<p class="l-text">DPG'de gördüğün aynı zincir kuralı — yalnızca şimdi eleştirmen herkesin ne yaptığını da görür. Bu ekstra bilgi gradyanı daha az gürültülü hale getirir ve MADDPG'nin koordine davranış öğrenmesini sağlar.</p>
<p class="l-text">Asgari bir işbirlikçi deney: 2 boyutlu düzlemde iki ajan, her biri kendi hedefine ulaşmak zorunda ama takım ödülü yalnızca her ikisi aynı bölümde başarılı olduğunda verilir. IPPO bunu bazen çözer; MAPPO neredeyse her zaman çözer. Aşağıdaki eğri tipik farkı çiziktirir.</p>
<div id="plot-rl13-marl-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. 2026 Cephesi — MARL Şu An Nerede?</h2>
<p class="l-text">Çok ajanlı öğrenme 2026'nın en aktif araştırma alanlarından biri, kısmen RL'in, oyun teorisinin ve LLM ajanlarının kesişiminde durduğu için. Hızlı bir tur:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Beliren iletişim</div><div class="card-body">OpenAI saklambaç (2019) — ajanlar kendilerine söylenmeden alet kullanımını ve iletişim sinyallerini icat etti. Hâlâ canlı bir araştırma damarı.</div></div>
<div class="calc-card"><div class="card-title">Diplomacy ve CICERO</div><div class="card-body">Meta 2022. Doğal dil müzakeresi gerektiren karışık güdülü bir oyun. Bir LLM diyalog modülünü klasik planlama + RL ile birleştirir.</div></div>
<div class="calc-card"><div class="card-title">Sıfır-atış koordinasyon</div><div class="card-body">Hiç görmediği yeni bir partnerle işbirliği yapabilen bir politika eğit — insan–AI takımları için kritik. Hanabi kanonik kıyaslama.</div></div>
<div class="calc-card"><div class="card-title">LLM-politika çok ajan</div><div class="card-body">Doğal dilde haberleşen birkaç LLM ajanı (ReAct, AutoGen, CrewAI). Bu ders ile ajan rotası arasında doğrudan köprü.</div></div>
<div class="calc-card"><div class="card-title">Kendi-eşleşmesi ölçeklemesi</div><div class="card-body">AlphaStar, OpenAI Five — geçmiş sürümlerin ligi müfredata dönüşen popülasyon tabanlı eğitim.</div></div>
<div class="calc-card"><div class="card-title">Mekanizma tasarımı + RL</div><div class="card-body">Aynı zamanda kuralları da tasarlayan bir ajan eğit — açık artırma teorisi ve ekonomi ile kesişimde yükselen alan.</div></div>
</div>
<div class="think-box"><div class="think-label">ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Sürekli eylemler argmax tabanlı Q-öğrenmeyi kırar — eylemi çıktı veren bir aktöre ve onu notlandıran bir eleştirmene ihtiyacın var.<br><strong>2.</strong> DPG deterministik zincir kuralı gradyanını verir; DDPG = DPG + DQN hileleri (tekrar, hedefler, gürültü).<br><strong>3.</strong> DDPG kırılgandır (aşırı tahmin, hiperparametre hassasiyeti). TD3 onu ikiz eleştirmen, gecikmeli güncelleme ve hedef yumuşatma ile yamalar.<br><strong>4.</strong> SAC entropi bonusu ekler ve sıcaklığı otomatik ayarlar — robotik ve MuJoCo için 2026 standardı.<br><strong>5.</strong> Çok ajanlı RL özellikle tek bir ajanın bakış açısından dünya durağan olmadığı için zordur.<br><strong>6.</strong> Bağımsız öğreniciler düşünüldüğünden daha güçlü bir tabandır; CTDE (MADDPG, QMIX, MAPPO) ciddi iş için baskın paradigmadır.<br><strong>7.</strong> 2026 cephesi MARL'ı LLM ajanlarıyla bağlar — beliren iletişim, Diplomacy/CICERO, AutoGen tarzı müzakere.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var ep = Array.from({length:60}, function(_,i){return (i+1)*500;});
  function curve(start, slope, ceil, jitter){
    return ep.map(function(_,i){ return Math.min(ceil, start + slope*i) + (Math.random()-0.5)*jitter; });
  }
  var ddpg = curve(-1400, 18, -350, 90);
  var td3  = curve(-1400, 22, -200, 60);
  var sac  = curve(-1400, 28, -150, 45);
  var data = [
    {x:ep, y:ddpg, name:'DDPG', type:'scatter', mode:'lines', line:{color:'#e07a5f', width:2}},
    {x:ep, y:td3,  name:'TD3',  type:'scatter', mode:'lines', line:{color:'#81b29a', width:2}},
    {x:ep, y:sac,  name:'SAC',  type:'scatter', mode:'lines', line:{color:T.accent,  width:2.4}}
  ];
  var layout = {
    title:'Pendulum-v1 — DDPG vs TD3 vs SAC (stilize)',
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:T.text},
    xaxis:{title:'Ortam adımı', gridcolor:T.grid},
    yaxis:{title:'Ortalama getiri', gridcolor:T.grid},
    legend:{orientation:'h', y:-0.18},
    margin:{t:60,r:30,b:60,l:60}
  };
  ['plot-rl13-conv-tr','plot-rl13-conv-en'].forEach(function(id){
    var el = document.getElementById(id);
    if (el && window.Plotly) Plotly.newPlot(id, data, layout, {displayModeBar:false});
  });

  var ep2 = Array.from({length:50}, function(_,i){return (i+1)*200;});
  function marlcurve(slope, ceil, jitter, offset){
    return ep2.map(function(_,i){ return Math.min(ceil, offset + slope*i) + (Math.random()-0.5)*jitter; });
  }
  var ippo  = marlcurve(0.012, 0.55, 0.08, 0.05);
  var mappo = marlcurve(0.020, 0.92, 0.05, 0.05);
  var data2 = [
    {x:ep2, y:ippo,  name:'IPPO (bağımsız)', type:'scatter', mode:'lines', line:{color:'#e07a5f', width:2}},
    {x:ep2, y:mappo, name:'MAPPO (CTDE)',     type:'scatter', mode:'lines', line:{color:T.accent,  width:2.4}}
  ];
  var layout2 = {
    title:'İşbirlikçi ulaşma görevi — IPPO vs MAPPO başarı oranı',
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:T.text},
    xaxis:{title:'Bölüm', gridcolor:T.grid},
    yaxis:{title:'Ortak başarı oranı', gridcolor:T.grid, range:[0,1]},
    legend:{orientation:'h', y:-0.18},
    margin:{t:60,r:30,b:60,l:60}
  };
  ['plot-rl13-marl-tr','plot-rl13-marl-en'].forEach(function(id){
    var el = document.getElementById(id);
    if (el && window.Plotly) Plotly.newPlot(id, data2, layout2, {displayModeBar:false});
  });
}, 250);
</script>`
};
