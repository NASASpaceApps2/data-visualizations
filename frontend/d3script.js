
function start(data) {

  let margin = ({top: 10, right: 120, bottom: 10, left: 140})
  let width = window.innerWidth - margin.left - margin.right
  let height = window.innerHeight * 2- margin.top - margin.bottom
  let dy = width / 6 
  let dx = 10 * 2
  let tree = d3.tree().nodeSize([dx, dy])
  let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
  
  const root = d3.hierarchy(data);
  
  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });
  
  const svg = d3.create("svg")
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("font", "18px Verdana")
      .style("user-select", "none");
  
  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);
  
  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");
  
  function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();
  
    // Compute the new tree layout.
    tree(root);
  
    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const shorten = (d) => {
      if (d.length > 20) {
        return d.substring(0, 18) + "..."
      }
      return d
    }
  
    const height = right.x - left.x + margin.top + margin.bottom;
  
    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"))
        .attr("width", window.innerWidth)
        .attr("height", height);
  
    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);
  
    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });
  
    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);
  //https://data.nasa.gov/browse?q=%20atmosphere+%20Nasa%20Goddard%20Global%20Change%20Data%20Center+%20Geospatial&sortBy=relevance

        const nasaBrowsify = (name) => {
          return `https://data.nasa.gov/browse?q=${encodeURIComponent(name.trim())}&sortBy=relevance`
        }

    let no = nodeEnter.append("text")
    no
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .on("click", (d,i) => window.open(nasaBrowsify(i.data.name)) )
        
        
    no    
        .text(d => shorten(d.data.name))
        .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white")
        //\\\
        
  
    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);
  
    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);
  
    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);
  
    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });
  
    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);
  
    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });
  
    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  
  update(root);
  
  // Work on vanilla JS
  let ele = d3.select('#container')
  if (ele.empty) {
    d3.select('body').append('div').attr('id', 'container')
    ele = d3.select('#container')
  }
  d3.select('#container').append(function(){return svg.node();}).attr("width", width).attr("height", height)
  
  }
  
  (async function() {
    const data = await d3.json("./tree.json");
    start(data);
  })();