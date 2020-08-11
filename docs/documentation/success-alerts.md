# Showing sucess alerts

Information to support implementing this example goes here.

**Example success alert**

```
{% set message %}
  {% if showMessage %}
    <div class="govuk-success-summary" role="alert" aria-labelledby="success-summary-heading" tabindex="-1">
      <h3 class="govuk-success-summary__title" id="success-summary-heading">Hello {{ data['your_name'] }} </h3>
  </div>
  {% endif %}
{% endset %}

{{ message | safe }}
```

**Example route**

```
router.get('/examples/success-alerts/result', function (req, res) {
    res.render('examples/success-alerts/answer', { showMessage: true })
})

```

[View the example](/docs/examples/success-alerts)
