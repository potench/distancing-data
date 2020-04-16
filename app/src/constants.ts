/* @flow */
/* eslint-disable import/prefer-default-export */
import {css} from '@emotion/core';
import './common.scss';

export const globalStyles = css`
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

    html {
        box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }

    * {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
            Droid Sans, Helvetica Neue, sans-serif;
        color: #3b425b;
        font-weight: 400;
    }

    html,
    body,
    main,
    #___gatsby,
    #gatsby-focus-wrapper {
        height: 100%;
        margin: 0;
    }

    h1 {
        font-weight: 300;
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: 'Raleway', sans-serif;
        font-weight: 600;
        margin: 0;
    }

    p {
        line-height: 1.6;
        margin: 0;
        color: #3b425b;
    }

    .no-shortage {
        background-color: palegreen;
    }

    .maybe-shortage {
        background-color: lightgoldenrodyellow;
    }

    .shortage {
        background-color: palevioletred;
    }

    .warning {
        background-color: lightgoldenrodyellow;
    }

    .ok {
        background-color: lightgreen;
    }

    .danger {
        background-color: palevioletred;
    }

    .table {
        td {
            border: 1px solid #dee2e6;
            font-weight: 300;
        }
    }

    .table-striped tbody tr:nth-of-type(odd) {
        .no-shortage {
            background-color: lightgreen;
        }

        .maybe-shortage {
            background-color: lightgoldenrodyellow;
        }

        .shortage {
            background-color: palevioletred;
        }
    }

    .asc {
        border: 1px solid red;

        &::after {
            content: '⌄';
            font-size: 12px;
        }
    }

    .desc {
        border: 1px solid blue;

        &::after {
            content: '⌄';
            font-size: 12px;
        }
    }

    .main {
        position: relative;
    }

    .main-header {
        position: sticky;
        top: 0px;
        z-index: 2;
    }

    .main-body {
        z-index: 1;
    }

    .card-header {
        background-color: #ecfaeb;
    }

    .chart {
        padding: 1em;
        background: #f2fff7;
        box-shadow: -5px -5px 10px #fff, 5px 5px 10px #f2fff3;
    }

    .search-label {
        margin-bottom: 0px;
    }

    .react-bootstrap-table {
        min-width: 1100px;
    }

    .table {
        overflow: hidden; /* because border-collapse causes overflow */
    }

    .table thead th {
        outline: 0px solid transparent; /* fixes blue box appearing on sort */
    }
`;
