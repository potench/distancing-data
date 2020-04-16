import {Link} from 'gatsby';
import React, {FC} from 'react';
import {ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';

const Links: FC = () => {
    return (
        <>
            <ButtonToolbar aria-label="Toolbar with button groups">
                <ButtonGroup className="mr-2" aria-label="First group">
                    <Link to="/">
                        <Button variant="primary" size="lg">
                            Countries
                        </Button>
                    </Link>
                </ButtonGroup>
                <ButtonGroup className="mr-2" aria-label="Second group">
                    <Link to="/states">
                        <Button variant="primary" size="lg">
                            US States
                        </Button>
                    </Link>
                </ButtonGroup>
            </ButtonToolbar>
        </>
    );
};

export default Links;
