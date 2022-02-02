import React from "react";
import president from "../../assets/images/president.webp"

const PageNotFound = ( ) => {
    return (
        <div style={{ backgroundImage:`url(${president})` }} className="overflow-hidden db bg-center cover aspect-ratio--object">
            <section class="vh-100 baskerville">
                <header class="tc ph5 lh-copy">
                    <h1 class="f1 fw9 f-headline-l code mb3 mt6 dib tracked-tight dark-blue">404</h1>
                    <h2 class="tc f1-l fw1 dark-green fw6">Where is the server?</h2>
                </header>
            </section>
        </div>
    )
}

export default PageNotFound;