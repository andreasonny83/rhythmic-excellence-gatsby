import React, { PureComponent } from 'react';
import propTypes from 'prop-types';

import './Homepage.css';

const HomepageWrapper = WrappedComponent => {
  return class HomepageWrapperComponent extends PureComponent {
    render() {
      const { data } = this.props;
      const homepageData = data.edges && data.edges[0] && data.edges[0].node;
      const title = homepageData.frontmatter && homepageData.frontmatter.title;
      const content = homepageData.html;

      return <WrappedComponent title={title} content={content} />;
    }
  };
};

HomepageWrapper.propTypes = {
  data: propTypes.any.isRequired,
};

const HomepageComponent = props => {
  const { title, content } = props;

  return (
    <div className="Homepage">
      <div className="container content">
        <h2 className="title">{title}</h2>
        <p dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export const Homepage = HomepageWrapper(HomepageComponent);
