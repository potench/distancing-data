import React, {FC} from 'react';
import Links from './Links';

interface TopSectionProps {
    dateDisplay: string;
}

const TopSection: FC<TopSectionProps> = ({dateDisplay}) => {
    const title = dateDisplay ? (
        <h1 className="title">🦠 Live Covid-19 Cases for <strong>{ dateDisplay }</strong></h1>
    ) : (
        <h1 className="title">🦠 Live Covid-19 Cases <i>loading...</i></h1>
    )
    return (
        <>
            { title }
            <p className="description pt-3">
                <strong>Days until reopening</strong> assumes (1) limited re-opening will be possible when the number of active cases is 1 per 10,000 people or less, and (2) the availability of widespread testing and contact tracing. 
                Peak estimates are based on <a href="https://www.facebook.com/blakestah">Dave Blake Jr.'s</a> work. See this <a href="https://medium.com/@dblake.mcg/estimating-peak-covid19-infection-rates-950c7f3cfc1a?sk=12e76358dedf8294e01e247e2c663bde">post</a>. 
                Estimated ICU beds assume 1 bed per 10,000 people, and 10% of cases will need one. 
            </p>
            <p className="pt-3">
                The real-time nature of this event means we cannot promise our estimates are accurate. 
                Data is pulled daily from <a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports">this repository</a>.
                You may download the source code for the database for this site <a href="https://github.com/potench/distancing-data">here</a>.
            </p>
        </>
    );
};

export default TopSection;
