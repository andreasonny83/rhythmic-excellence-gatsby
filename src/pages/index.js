import React, { Component } from 'react';
import propTypes from 'prop-types';

import { Hero } from '../components/Hero';
import { Homepage } from '../components/Homepage';
import { Disciplines } from '../components/Disciplines';
import { Map } from '../components/Map';
import { ContactUs } from '../components/ContactUs';
import { Footer } from '../components/Footer';

import Layout from '../components/layout';
import { graphql } from 'gatsby';

const windowGlobal = typeof window !== 'undefined' && window;

class Index extends Component {
  constructor() {
    super();

    const { zoom, height } = this.calculateZoomLevel();

    this.state = {
      zoom,
      height,
    };
  }

  calculateZoomLevel() {
    const zoom =
      windowGlobal.innerWidth <= 600
        ? 11
        : windowGlobal.innerWidth <= 1100
          ? 12
          : 13;
    const height =
      windowGlobal.innerHeight < 800 ? windowGlobal.innerHeight + 100 : 900;

    return {
      zoom,
      height,
      ready: false,
    };
  }

  onReady = () => {
    this.setState({ ready: true });
  };

  render() {
    const { data } = this.props;
    const { ready, zoom, height } = this.state;

    return (
      <Layout>
        <IndexPage
          data={data}
          apiKey="AIzaSyCkDPUgSzkaOJDbzi7PhmVLoKoiIwWg0Lk"
          height={height}
          zoom={zoom}
          ready={ready}
          onReady={this.onReady}
        />
      </Layout>
    );
  }
}

const IndexPage = ({ data, apiKey, height, zoom, ready, onReady }) => {
  return (
    <div className={`App ${ready ? 'ready' : ''}`}>
      <Hero onReady={onReady} />
      <section className="Home__content">
        <Homepage data={data.home} />
        <Disciplines disciplines={data.disciplines} />
        {onReady && (
          <Map
            isMarkerShown
            zoom={zoom}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.34`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `${height}px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        )}
        <ContactUs />
        <Footer />
      </section>
    </div>
  );
};

IndexPage.propTypes = {
  data: propTypes.any.isRequired,
  apiKey: propTypes.string.isRequired,
  height: propTypes.number.isRequired,
  zoom: propTypes.number.isRequired,
  onReady: propTypes.func.isRequired,
};

IndexPage.defaultProps = {
  height: 800,
};

export default Index;

export const pageQuery = graphql`
  query HomepageQuery {
    disciplines: allMarkdownRemark(
      filter: { fields: { category: { eq: "discipline" } } }
      sort: { fields: [frontmatter___position], order: ASC }
      limit: 10
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }

    home: allMarkdownRemark(
      filter: { fields: { category: { eq: "home" } } }
      limit: 1
    ) {
      edges {
        node {
          html
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
