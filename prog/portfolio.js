class PortfolioProgram extends Program {
    createWindow() {
        let wminfo = {
            name: 'Portfolio',
            title: 'Portfolio',
            icon:  'img/desktop/MyDocuments.png',
            height: window.innerHeight - 150,
            y: 100,
            x: 100
        }

        let body = `
            <div class="typography">
                <h2> Portfolio </h2>
                <subtitle> Here's some projects I've worked on in the past.</subtitle>
                
                <hr class="hr--accent2"/>

                <h4> Work </h4>

                <br/>
                <b> NASA Jet Propulsion Laboratory </b> (<a href="https://jpl.nasa.gov/" target="_blank">web</a>)

                <ul>
                    <li>
                        <a href="https://ml.jpl.nasa.gov/products/codex/codex.html" target="_blank">Complex Data Explorer (CODEX)</a><br/>
                        <span class="text--highlighted">Currently working</span> on a first-pass data analytics framework for interactive analysis of terabyte-scale datasets with the JPL Machine Learning and Instrument Autonomy Group (MLIA).
                    </li>
                    <li>
                        <a href="https://trs.jpl.nasa.gov/bitstream/handle/2014/47056/CL%2316-4217.pdf?sequence=1&isAllowed=y" target="_blank">Integrated Modeling Environment</a><br/>
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
                        MiRaTA launched in 2017 from Vandenburg Air Force Base.
                    </li>
                </ul>

                <hr class="hr--accent2"/>

                <h4> Side Projects </h4>
                <p> Various things I've created, in many languages. </p>

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
                        Mute advertisements on-the-fly in a live news feed using computer vision.
                    </li>
                    <li>
                        <a href="https://kage.dev/passcalc" target="_blank">Passcalc</a><br/>
                        A simple tool to help you figure out how much you need to pass at UoE.
                    </li>
                    <li>
                        <a href="https://github.com/pkage/snooski" target="_blank">Snooski</a><br/>
                        A terminal-based Reddit client, with full article rendering.
                    </li>
                    <li>
                        <a href="https://github.com/pkage/hackernewslc" target="_blank">Hacker News L+C</a><br/>
                        An extension to add link+comment buttons to Hacker News.
                    </li>
                </ul>

                <hr class="hr--accent2"/>


                <h4> School </h4>
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
                        <a href="https://2020.hacktheburgh.com/" target="_blank">Hack the Burgh 2020</a><br/>
                        Wrote the website for the 2020 iteration of Hack the Burgh.
                    </li>
                    <li>
                        <a href="https://github.com/compsoc-edinburgh/" target="_blank">HtB 2020 Admissions</a><br/>
                        Created a voting portal for admitting applications to HtB 2020.<br/>
                        <i>May be private now.</i>

                    </li>
                    <li><a href="https://2019.hacktheburgh.com/" target="_blank">Hack the Burgh 2019</a><br/>
                        Wrote the website for the 2019 iteration of Hack the Burgh.
                
                    </li>
                </ul>

            </div>
        `

        return [wminfo, body]
    }

    onAttach() {
        this.getBodyHandle()
            .classList.add('window-body--overflow-y')
    }
}

window.pm.registerPrototype('portfolio', PortfolioProgram)
