d3.json('samples.json').then((
    {
        names
    }
    ) =>
{
    names.forEach(name =>
    {
        d3.select('select').append('option').text(name);
    }
    );
    showData()
}
);

function showPanel(metadata)
{
    Object.entries(metadata).forEach(([key, val]) =>
    {
        d3.select('.panel-body').append('h5').text(key.toUpperCase() + ': ' + val);
    }
    );
}

function showBar(otu_ids, sample_val_data, otu_lables)
{

    var bar_data = [
        {
            x: sample_val_data.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).reverse().map(x => 'OTU ' + x),
            type: 'bar',
            orientation: 'h',
        }
    ];

    var bar_label =
    {
        title: 'Top 10 Bacteria Cultures'
    }

    Plotly.newPlot('bar', bar_data, bar_label);
}

function showBubble(otu_ids, sample_val_data, otu_lables)
{
    var bubble_data =
    {
        x: otu_ids,
        y: sample_val_data,
        text: otu_lables,
        mode: 'markers',
        marker:
        {
            size: sample_val_data,
            color: otu_ids,
        }
    };

    var bubble_layout =
    {
        title: 'Bacteria Cultures Per Sample',
        showlegend: false,
        height: 600,
        width: 1200,
        xaxis:
        {
            title:
            {
                text: 'OTU ID',
                font:
                {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            },
        },

    };

    Plotly.newPlot('bubble', [bubble_data], bubble_layout);
}

function showGuage(wfreq)
{

    var gauge_data = [
        {
            type: "indicator",
            mode: "gauge+number",
            value: wfreq,
            title:
            {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"
            },
            gauge:
            {
                axis:
                {
                    range: [null, 10],
                    tickwidth: 1,
                    tickcolor: "darkblue"
                },
                bar:
                {
                    color: "black"
                },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    {
                        range: [0, 2],
                        color: "red"
                    },
                    {
                        range: [2, 4],
                        color: "orange"
                    },
                    {
                        range: [4, 6],
                        color: "yellow"
                    },
                    {
                        range: [6, 8],
                        color: "lightgreen"
                    },
                    {
                        range: [8, 10],
                        color: "green"
                    }
                ]
            }
        }

    ];

    var gauge_layout =
    {
        width: 600,
        height: 400
    };
    Plotly.newPlot('gauge', gauge_data, gauge_layout);

}

function showData()
{
    var name = d3.select('select').property('value');

    d3.json('samples.json').then((
        {
            metadata,
            samples
        }
        ) =>
    {

        var sample_metadata = metadata.filter(obj => obj.id == name)[0];
        var sample = samples.filter(obj => obj.id == name)[0];

        showPanel(sample_metadata)
        // console.log(sample)

        var indices = new Array(sample.otu_ids.length);
        for (var i = 0; i < sample.otu_ids.length; ++i)
            indices[i] = i;
        indices.sort(
            function (a, b)
        {
            return sample.sample_values[a] > sample.sample_values[b] ? -1 : sample.sample_values[a] < sample.sample_values[b] ? 1 : 0;
        }
        );
        var otu_ids = new Array(indices.length);
        var sample_val_data = new Array(indices.length);
        var otu_lables = new Array(indices.length);
        for (var i = 0; i < indices.length; ++i)
        {
            otu_ids[i] = sample.otu_ids[indices[i]]
                sample_val_data[i] = sample.sample_values[indices[i]]
                otu_lables[i] = sample.otu_labels[indices[i]]
        }
        var gaugeArray = metadata.filter(obj => obj.id == name);
        var wfreqs = gaugeArray[0].wfreq;

        showBar(otu_ids, sample_val_data, otu_lables)
        showBubble(otu_ids, sample_val_data, otu_lables)

        showGuage(wfreqs)

    }
    );
};

function optionChanged(name)
{
    showData();
};
