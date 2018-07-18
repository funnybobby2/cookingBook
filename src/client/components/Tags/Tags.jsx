import React from 'react';
import PropTypes from 'prop-types';
// import react component
import Tag from './Tag';
import TagAdd from './TagAdd';
// Import style
import './Tags.scss';

const Tags = ({
  tags, edition, recipeID, maestro
}) => (
  <div className="tags">
    <div className="tagsTitle">Tags</div>
    <div className="tagsDisplay">
      {tags.map((tag, index) => <Tag text={tag} key={tag} index={index} edition={edition} recipeID={recipeID} maestro={maestro} />)}
      <TagAdd key={(tags.length + 1)} edition={edition} recipeID={recipeID} maestro={maestro} />
    </div>
  </div>
);

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  edition: PropTypes.bool,
  recipeID: PropTypes.number,
  maestro: PropTypes.object
};

Tags.defaultProps = { // define the default props
  tags: [],
  edition: false,
  recipeID: 1,
  maestro: { dataRefresh: () => {} }
};

export default Tags;
