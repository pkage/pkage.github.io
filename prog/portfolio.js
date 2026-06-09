class PortfolioProgram extends Program {
    createWindow() {
        let wminfo = {
            name: 'Portfolio - Work',
            title: 'Portfolio - Work',
            icon:  'img/desktop/MyDocuments.png',
            y: 40,
            x: isMobileBrowser() ? 20 : 120
        }

        let body = `
            <div class="typography">
                <h2> Portfolio / Work </h2>
                <subtitle> Here's some projects I've worked on in the past.</subtitle>
                
                <hr class="hr--accent2"/>

                <p>
                    <i> Note that some works here may be proprietary, so limited information may be released.</i>
                <p>

                <b> SpaceRake </b> (<a href="https://spacerake.net/" target="_blank">web</a>)

                <ul>
                    <li>
                        <span class="text--highlighted">Currently working</span> on laser communcations hardware for spacecraft, aircraft, and terrestrial stations.
                    </li>
                    <li> Working on machine vision, networking, and low-level systems programming. </li>
                </ul>

                <br/>
                <b> NASA Jet Propulsion Laboratory </b> (<a href="https://jpl.nasa.gov/" target="_blank">web</a>)

                <ul>
                    <li>
                        <a href="https://ml.jpl.nasa.gov/products/codex/codex.html" target="_blank">Complex Data Explorer (CODEX)</a><br/>
                        Worked on a first-pass data analytics framework for interactive analysis of terabyte-scale datasets with the JPL Machine Learning and Instrument Autonomy Group (MLIA).
                    </li>
                    <li>
                        <a href="https://trs.jpl.nasa.gov/bitstream/handle/2014/47056/CL%2316-4217.pdf?sequence=1&isAllowed=y" target="_blank">Integrated Modeling Environment (IME)</a><br/>
                        Worked on propulsion system diagramming to model binding, and a general purpose plugin framework to support mission formulation (Team X/Ops Lab).
                    </li>
                </ul>

                <br/>
                <b> Aurora Flight Sciences </b> (<a href="https://aurora.aero/" target="_blank">web</a>)
                <ul>
                    <li>
                        <b> DeMi microsatellite </b><br/>
                        Was involved in mission formulation and FSW development for the Deformable Mirror Demonstration Mission (DeMi) satellite while at Aurora.
                    </li>
                    <li>
                        <b> Modular Ground System Architecture </b><br/>
                        Created new IP for Aurora, a new pluggable architecture for extensible ground systems for drones, satellites, and terrestrial robotics.
                    </li>
                </ul>
                

                <br/>
                <b> MIT <abbr title="Space Telecommunications, Astronomy, and Radiation">STAR</abbr> Laboratory </b> (<a href="https://starlab.mit.edu" target="_blank">web</a>)
                <ul>
                    <li>
                        <a href="https://github.com/apollokit/CSTAR" target="_blank">CSTAR</a><br/>
                        Extensions to CesiumJS for creating visualizations
                    </li>
                    <li>
                        <b>MiRaTA microsatellite</b><br/>
                        Was invovled in ground station/flight software, ground station still in use at MIT Lincoln Labs. 
                        MiRaTA launched in 2017 from Vandenberg Air Force Base.
                    </li>
                </ul>
            </div>
        `

        return [wminfo, body]
    }

    createResearchWindow() {
        let wminfo = {
            name: 'Portfolio - Research',
            title: 'Portfolio - Research Projects',
            icon:  'img/desktop/MyDocuments.png',
            y: 100,
            x: isMobileBrowser() ? 80 : 240
        }

        let body = `
            <div class="typography">
                <h2> Portfolio / Research </h2>
                <subtitle> Here are some of the research projects I've been involved in.</subtitle>
                
                <hr class="hr--accent2"/>

                <br/>
                <b> Implicit Data Synthesis for Contrastive Unsupervised Data Augmentation </b><br/><span>Patrick Kage, Trevor Hedges, N. Siddharth, Pavlos Andreadis (2026, <a href="https://arxiv.org/abs/2606.07498" target="_blank">arXiv</a>).</span>
                <p>
                <details>
                    <summary>Abstract</summary>
                    <div class="typography--normaltext">
                        Scientific observations generate large quantities of unlabeled data which is
                        laborious to hand-label, making unsupervised learning techniques valuable for
                        processing datasets. Among these approaches, contrastive learning provides a
                        convenient mechanism for extracting structural representations from unannotated
                        datasets. For natural imagery, the general approach is to use a variety of
                        data-space augmentation methods in order to generate synthetic samples;
                        however, for scientific observations data-space perturbations can fundamentally
                        alter the underlying data. Our proposed method is to generate contrastive
                        samples by perturbing the network weights rather than the underlying data, thus
                        more closely preserving the structure of the data. We demonstrate this
                        technique using a SimCLR-based pipeline applied over radar observations of
                        meteors, and show performance gains under matched protocols.
                    </div>
                </details>
                </p>

                <br/>
                <b> A Review of Pseudo-Labeling for Computer Vision</b><br/><span>Patrick Kage, Jay C. Rothenberger, Pavlos Andreadis, Dimitrios I. Diochnos (2026, <a href="https://jair.org/index.php/jair/article/view/19656" target="_blank">JAIR</a>).</span>
                <p>
                <details>
                    <summary>Abstract</summary>
                    <div class="typography--normaltext">
                        Deep neural models have achieved state-of-the-art performance on a wide range
                        of problems in computer science, especially in computer vision. However, deep
                        neural networks often require large datasets of labeled samples to generalize
                        effectively. An important area of active research is semi-supervised learning,
                        which attempts to instead utilize large quantities of (easily acquired)
                        unlabeled samples. One family of methods in this space is pseudo-labeling, a
                        class of algorithms that use model outputs to assign labels to unlabeled
                        samples which are then used as labeled samples during training. Such assigned
                        labels, called pseudo-labels, are most commonly associated with the field of
                        semi-supervised learning. In this work, we explore a broader interpretation of
                        pseudo-labels within both self-supervised and unsupervised methods. After a
                        thorough treatment of pseudo-labeling in these areas, we draw the connection
                        between them and identify commonalities between fields, as well as new
                        directions where advancements in one area would likely benefit others, such as
                        curriculum learning and self-supervised regularization.
                    </div>
                </details>
                </p>

                <br/>
                <b> Multi-modal, multi-scale representation learning for satellite imagery analysis just needs a good ALiBi </b><br/><span>Patrick Kage, Pavlos Andreadis (2024, <a href="https://arxiv.org/abs/2604.10347" target="_blank">arXiv</a>).</span>
                <p>
                <details>
                    <summary>Abstract</summary>
                    <div class="typography--normaltext">
                        Vision foundation models have been shown to be effective at processing
                        satellite imagery into representations fit for downstream tasks, however,
                        creating models which operate over multiple spatial resolutions and modes is
                        challenging. This paper presents Scale-ALiBi, a linear bias transformer
                        attention mechanism with a spatial encoding bias to relationships between image
                        patches at different ground sample distance scales. We provide an
                        implementation of Scale-ALiBi over a dataset of aligned high- and
                        low-resolution optical and low-resolution SAR satellite imagery data using a
                        triple-contrastive and reconstructive architecture, show an improvement on the
                        GEO-Bench benchmark, and release the newly curated dataset publicly.
                    </div>
                </details>
                </p>

                <br/>
                <b> Class Introspection: A Novel Technique for Detecting Unlabeled Subclasses by Leveraging Classifier Explainability Methods </b><br/><span>Patrick Kage, Pavlos Andreadis (2021, <a href="https://arxiv.org/abs/2107.01657" target="_blank">arXiv</a>)</span>
                <p>
                <details>
                    <summary>Abstract</summary>
                    <div class="typography--normaltext">
                    Detecting latent structure within a dataset is a crucial step in performing
                    analysis of a dataset. However, existing state-of-the-art techniques for
                    subclass discovery are limited: either they are limited to detecting very
                    small numbers of outliers or they lack the statistical power to deal with
                    complex data such as image or audio. This paper proposes a solution to this
                    subclass discovery problem: by leveraging instance explanation methods, an
                    existing classifier can be extended to detect latent classes via
                    differences in the classifier's internal decisions about each instance.
                    This works not only with simple classification techniques but also with
                    deep neural networks, allowing for a powerful and flexible approach to
                    detecting latent structure within datasets. Effectively, this represents a
                    projection of the dataset into the classifier's "explanation space," and
                    preliminary results show that this technique outperforms the baseline for
                    the detection of latent classes even with limited processing.  This paper
                    also contains a pipeline for analyzing classifiers automatically, and a web
                    application for interactively exploring the results from this technique.
                    </div>
                </details>
                </p>
                <p>
                    This is an adaptation for publication of my honours project
                    paper, which can be found <a href="https://misc.ka.ge/honours.pdf"
                    target="_blank">here</a>. Watch me talk about it at the Knowledge
                    Representation for Hybrid and Compositional Artificial Intelligence workshop <a
                    href="https://www.youtube.com/watch?v=i2gULufLnf8">here</a> (at KR 2021: 18th
                    International Conference on Principles of Knowledge Representation and
                    Reasoning).
                </p>

                <br/>
                <b> Research Interests </b><br/>
                <p>
                    Research topics I am interested in pursuing:
                </p>
                <ul>
                    <li>Unsupervised learning</li>
                    <li>Semi-/weakly supervised learning</li>
                    <li>Human Computer Interaction</li>
                    <li>Computer Vision</li>
                </ul>
            </div>
        `

        return [wminfo, body]
    }
    createSchoolWindow() {
        let wminfo = {
            name: 'Portfolio - School',
            title: 'Portfolio - School Related Projects',
            icon:  'img/desktop/MyDocuments.png',
            y: 60,
            x: isMobileBrowser() ? 40 : 160
        }

        let body = `
            <div class="typography">
                <h2> Portfolio / School </h2>
                <subtitle> Here are some projects I've built while at university.</subtitle>
                
                <hr class="hr--accent2"/>

                <br/>
                <b> CompSoc </b> (<a href="https://comp-soc.com/" target="_blank">web</a>) <br/>
                <p>
                    I was Technical Secretary from 2018 to 2020 at CompSoc, the largest student society at the University of Edinburgh.
                </p>
                <ul>
                    <li> <a href="https://github.com/compsoc-edinburgh/infball19-frontend"> Informatics Ball </a> <br/>
                    Created the frontend for ticket sales to the Informatics Ball.
                    </li>
                </ul>


                <br/>
                <b> Hack the Burgh </b><br/>
                <p>
                    As CompSoc Technical Secretary, I was also involved with Hack the Burgh&mdash;Scotland's largest 24 hour hackathon.
                </p>
                <ul>
                    <li>
                        <a href="https://2021.hacktheburgh.com/" target="_blank">Hack the Burgh 2021</a><br/>
                        Managed all technical aspects of the 2021 iteration of
                        Hack the Burgh, including moving the hackathon entirely
                        online.
                    </li>
                    <li>
                        <a href="https://github.com/compsoc-edinburgh/htb20-voter" target="_blank">HtB 2020 Admissions</a><br/>
                        Created a voting portal for admitting applications to HtB 2020.<br/>

                    </li>
                    <li>
                        <a href="https://2020.hacktheburgh.com/" target="_blank">Hack the Burgh 2020</a><br/>
                        Wrote the website for the 2020 iteration of Hack the Burgh.
                    </li>
                    <li>
                        <a href="https://github.com/compsoc-edinburgh/htb20-voter" target="_blank">HtB 2020 Admissions</a><br/>
                        Created a voting portal for admitting applications to HtB 2020.<br/>

                    </li>
                    <li><a href="https://2019.hacktheburgh.com/" target="_blank">Hack the Burgh 2019</a><br/>
                        Wrote the website for the 2019 iteration of Hack the Burgh.
                
                    </li>
                </ul>
            </div>
        `

        return [wminfo, body]
    }

    createPersonalWindow() {
        let wminfo = {
            name: 'Portfolio - Personal',
            title: 'Portfolio - Side Projects',
            icon:  'img/desktop/MyDocuments.png',
            y: 80,
            x: isMobileBrowser() ? 60 : 200
        }
        
        let body = `
            <div class="typography">
                <h2> Portfolio / Personal </h2>
                <subtitle> Various things I've created in my spare time, in many languages.</subtitle>
                
                <hr class="hr--accent2"/>

                <ul>
                    <li>
                        <a href="https://github.com/pkage/depgraph" target="_blank">Depgraph</a><br/>
                        A static analysis toolkit for Javascript, in use at NASA/JPL.
                    </li>
                    <li>
                        <a href="https://github.com/pkage/wirepickle" target="_blank">Wirepickle</a><br/>
                        A Python 0MQ-based IPC/RPC solution, also in use at NASA/JPL.
                    </li>
                    <li>
                        <a href="https://github.com/pkage/adstrip" target="_blank">Adstrip</a><br/>
                        Mute advertisements on-the-fly in a live news feed using computer vision, built with OpenCV and Python.
                    </li>
                    <li>
                        <a href="https://github.com/pkage/albumview" target="_blank">Coverflow for Spotify</a><br/>
                        A website that shows my listening history on Spotify, built with Nodejs and Vue.
                    </li>
                    <li>
                        <a href="https://kage.dev/passcalc" target="_blank">Passcalc</a><br/>
                        A simple tool to help you figure out how much you need to pass at UoE, built with vanilla JS.
                    </li>
                    <li>
                        <a href="https://github.com/pkage/snooski" target="_blank">Snooski</a><br/>
                        A terminal-based Reddit client with full article rendering, built with Python.
                    </li>
                    <li>
                        <a href="https://github.com/pkage/hackernewslc" target="_blank">Hacker News L+C</a><br/>
                        A browser extension to add link+comment buttons to Hacker News.
                    </li>
                    <li>
                        <a href="https://github.com/pkage/pkage.github.io" target="_blank">This Website</a><br/>
                        A faux-desktop environment with the look of windows 98, built with vanilla Javascript.

                    </li>
                </ul>

            </div>
        `

        return [wminfo, body]
    }

    onAttach() {
        window.wm.openWindow(...this.createSchoolWindow())
        window.wm.openWindow(...this.createPersonalWindow())
        window.wm.openWindow(...this.createResearchWindow())
    }
}

window.pm.registerPrototype('portfolio', PortfolioProgram)
