const React = require('react');

module.exports = {
  __esModule: true,
  BrowserRouter: ({ children }) => React.createElement(React.Fragment, null, children),
  Routes: ({ children }) => React.createElement(React.Fragment, null, children),
  Route: ({ children }) => React.createElement(React.Fragment, null, children),
  Link: ({ children, to }) => React.createElement('a', { href: typeof to === 'string' ? to : '#' }, children),
  Outlet: ({ children }) => React.createElement(React.Fragment, null, children),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' })
};